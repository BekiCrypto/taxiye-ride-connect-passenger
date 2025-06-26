
# Database Schema Documentation

## Overview

The Taxiye Passenger App uses Supabase PostgreSQL database with the following key features:
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates
- Automatic triggers for data consistency
- Optimized indexes for performance

## Database Tables

### Passengers Table

**Purpose**: Stores passenger profile information

```sql
CREATE TABLE public.passengers (
  email text,
  user_id uuid NOT NULL,
  phone text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  name text NOT NULL
);
```

**Key Fields**:
- `user_id`: References auth.users (UUID)
- `phone`: Unique identifier for passenger
- `name`: Display name
- `email`: Contact email

**Relationships**:
- One-to-many with rides (passenger_phone_ref)

### Rides Table

**Purpose**: Stores ride booking and history information

```sql
CREATE TABLE public.rides (
  driver_phone_ref text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  distance_km numeric,
  fare numeric,
  commission numeric,
  net_earnings numeric,
  created_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  passenger_name text,
  passenger_phone text,
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  status text DEFAULT 'pending'::text,
  passenger_phone_ref text
);
```

**Key Fields**:
- `id`: Primary key (UUID)
- `passenger_phone_ref`: Links to passenger
- `driver_phone_ref`: Links to assigned driver
- `pickup_location`: Origin address
- `dropoff_location`: Destination address
- `status`: Ride state (pending, accepted, started, completed, cancelled)
- `fare`: Total ride cost
- `distance_km`: Trip distance

**Status Flow**:
```
pending → accepted → started → completed
    ↓         ↓         ↓
cancelled  cancelled  cancelled
```

### Wallet Transactions Table

**Purpose**: Tracks all wallet-related financial transactions

```sql
CREATE TABLE public.wallet_transactions (
  status text DEFAULT 'completed'::text,
  driver_phone_ref text,
  created_at timestamp with time zone DEFAULT now(),
  type text NOT NULL,
  amount numeric NOT NULL,
  source text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  description text
);
```

**Key Fields**:
- `type`: Transaction type (top_up, payment, refund, bonus)
- `amount`: Transaction amount (positive for credits, negative for debits)
- `source`: Payment source (telebirr, bank_transfer, card, stripe)
- `status`: Transaction status (pending, completed, failed)

**Transaction Types**:
- `top_up`: Wallet funding
- `payment`: Ride payment
- `refund`: Payment reversal
- `bonus`: Referral earnings

### Drivers Table

**Purpose**: Stores driver information and vehicle details

```sql
CREATE TABLE public.drivers (
  plate_number text,
  vehicle_model text,
  approved_status text DEFAULT 'pending'::text,
  wallet_balance numeric DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  name text NOT NULL,
  vehicle_color text DEFAULT 'White'::text,
  email text,
  license_number text,
  phone text NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  is_online boolean DEFAULT false
);
```

### Notifications Table

**Purpose**: Stores push notifications and alerts

```sql
CREATE TABLE public.notifications (
  is_read boolean DEFAULT false,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text DEFAULT 'general'::text,
  title text NOT NULL,
  driver_phone_ref text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

**Notification Types**:
- `ride_request`: New ride booking
- `ride_update`: Status changes
- `payment`: Transaction notifications
- `promotional`: Marketing messages
- `system`: App updates and maintenance

### Promo Codes Table

**Purpose**: Manages promotional codes and referral system

```sql
CREATE TABLE public.promo_codes (
  current_uses integer DEFAULT 0,
  max_uses integer DEFAULT 1,
  driver_bonus numeric NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  expiry_date date
);
```

### Promo Redemptions Table

**Purpose**: Tracks promo code usage and referral bonuses

```sql
CREATE TABLE public.promo_redemptions (
  redeemed_at timestamp with time zone DEFAULT now(),
  amount_credited numeric,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  driver_phone_ref text,
  promo_code_id uuid
);
```

### Support Tickets Table

**Purpose**: Customer support and issue tracking

```sql
CREATE TABLE public.support_tickets (
  message text NOT NULL,
  status text DEFAULT 'open'::text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  ride_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  driver_phone_ref text,
  subject text NOT NULL
);
```

### SOS Alerts Table

**Purpose**: Emergency alert system

```sql
CREATE TABLE public.sos_alerts (
  driver_phone_ref text,
  location_lng numeric,
  location_lat numeric,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text DEFAULT 'active'::text,
  ride_id uuid,
  created_at timestamp with time zone DEFAULT now()
);
```

### Documents Table

**Purpose**: Document upload and verification

```sql
CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  file_url text,
  uploaded_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending'::text,
  driver_phone_ref text
);
```

## Database Functions

### User Profile Creation

```sql
CREATE OR REPLACE FUNCTION public.handle_new_passenger_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF (NEW.raw_user_meta_data->>'user_type' IS NULL OR NEW.raw_user_meta_data->>'user_type' = 'passenger') 
     AND (NEW.phone IS NOT NULL OR NEW.raw_user_meta_data->>'phone' IS NOT NULL) THEN
    INSERT INTO public.passengers (phone, user_id, name, email)
    VALUES (
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      NEW.email
    )
    ON CONFLICT (phone) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$
```

## Indexes and Performance

### Recommended Indexes

```sql
-- Ride lookups by passenger
CREATE INDEX idx_rides_passenger_phone ON rides(passenger_phone_ref);

-- Ride lookups by driver
CREATE INDEX idx_rides_driver_phone ON rides(driver_phone_ref);

-- Ride status queries
CREATE INDEX idx_rides_status ON rides(status);

-- Transaction lookups
CREATE INDEX idx_wallet_transactions_phone ON wallet_transactions(driver_phone_ref);

-- Notification queries
CREATE INDEX idx_notifications_phone ON notifications(driver_phone_ref);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### Query Optimization

**Efficient Ride History Query**:
```sql
SELECT r.*, d.name as driver_name, d.vehicle_model
FROM rides r
LEFT JOIN drivers d ON r.driver_phone_ref = d.phone
WHERE r.passenger_phone_ref = $1
ORDER BY r.created_at DESC
LIMIT 20;
```

**Wallet Balance Calculation**:
```sql
SELECT COALESCE(SUM(amount), 0) as balance
FROM wallet_transactions
WHERE driver_phone_ref = $1
AND status = 'completed';
```

## Row Level Security (RLS)

### Passengers Table Policies

```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON passengers
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON passengers
  FOR UPDATE USING (auth.uid() = user_id);
```

### Rides Table Policies

```sql
-- Passengers can view their own rides
CREATE POLICY "Passengers can view own rides" ON rides
  FOR SELECT USING (
    passenger_phone_ref IN (
      SELECT phone FROM passengers WHERE user_id = auth.uid()
    )
  );
```

### Security Best Practices

1. **Enable RLS** on all tables containing user data
2. **Use service role** for admin operations
3. **Validate user permissions** in policies
4. **Audit policy effectiveness** regularly

## Backup and Recovery

### Automated Backups
- **Daily backups** of full database
- **Point-in-time recovery** available
- **Cross-region replication** for disaster recovery

### Data Retention Policies
- **Ride data**: Retained for 2 years
- **Transaction data**: Retained for 7 years
- **Notification data**: Purged after 6 months
- **Log data**: Retained for 90 days

## Monitoring and Maintenance

### Performance Monitoring
- **Query execution time** tracking
- **Connection pool** monitoring
- **Index usage** analysis
- **Storage growth** tracking

### Maintenance Tasks
- **Weekly VACUUM** operations
- **Monthly statistics** updates
- **Quarterly index** rebuilding
- **Annual table** partitioning review
