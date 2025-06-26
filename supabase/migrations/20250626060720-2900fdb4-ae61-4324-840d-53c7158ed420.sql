
-- First, let's check and clean up duplicate phone numbers
-- We'll keep the most recent record for each phone number

-- Drop existing foreign key constraints that reference passengers.id
ALTER TABLE public.rides DROP CONSTRAINT IF EXISTS rides_passenger_id_fkey;

-- Drop existing policies to recreate them for passengers
DROP POLICY IF EXISTS "Users can view their own passenger profile" ON public.passengers;
DROP POLICY IF EXISTS "Users can update their own passenger profile" ON public.passengers;
DROP POLICY IF EXISTS "Users can insert their own passenger profile" ON public.passengers;

-- Drop the existing passengers table
DROP TABLE IF EXISTS public.passengers CASCADE;

-- Recreate passengers table with phone as primary key
CREATE TABLE public.passengers (
  phone text NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on passengers table
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for passengers
CREATE POLICY "Users can view their own passenger profile"
  ON public.passengers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own passenger profile"
  ON public.passengers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own passenger profile"
  ON public.passengers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update the rides table to reference passengers by phone
ALTER TABLE public.rides 
DROP COLUMN IF EXISTS passenger_id,
ADD COLUMN passenger_phone_ref text REFERENCES public.passengers(phone);

-- Now handle drivers table with duplicate cleanup
-- Drop existing foreign key constraints that reference drivers.id
ALTER TABLE public.rides DROP CONSTRAINT IF EXISTS rides_driver_id_fkey;
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_driver_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_driver_id_fkey;
ALTER TABLE public.promo_redemptions DROP CONSTRAINT IF EXISTS promo_redemptions_driver_id_fkey;
ALTER TABLE public.sos_alerts DROP CONSTRAINT IF EXISTS sos_alerts_driver_id_fkey;
ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_driver_id_fkey;
ALTER TABLE public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_driver_id_fkey;

-- Create a temporary table with unique drivers (keeping the most recent one for each phone)
CREATE TEMP TABLE temp_unique_drivers AS 
SELECT DISTINCT ON (phone) *
FROM public.drivers 
WHERE phone IS NOT NULL AND phone != ''
ORDER BY phone, created_at DESC;

-- Drop the existing drivers table
DROP TABLE public.drivers CASCADE;

-- Recreate drivers table with phone as primary key
CREATE TABLE public.drivers (
  phone text NOT NULL PRIMARY KEY,
  user_id uuid UNIQUE,
  name text NOT NULL,
  email text,
  license_number text,
  plate_number text,
  vehicle_model text,
  vehicle_color text DEFAULT 'White',
  is_online boolean DEFAULT false,
  approved_status text DEFAULT 'pending',
  wallet_balance numeric DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Restore unique data from temp table
INSERT INTO public.drivers 
SELECT phone, user_id, name, email, license_number, plate_number, vehicle_model, vehicle_color, is_online, approved_status, wallet_balance, created_at, updated_at
FROM temp_unique_drivers;

-- Update all related tables to use phone as foreign key
ALTER TABLE public.rides 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

ALTER TABLE public.documents 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

ALTER TABLE public.notifications 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

ALTER TABLE public.promo_redemptions 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

ALTER TABLE public.sos_alerts 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

ALTER TABLE public.support_tickets 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

ALTER TABLE public.wallet_transactions 
DROP COLUMN IF EXISTS driver_id,
ADD COLUMN driver_phone_ref text REFERENCES public.drivers(phone);

-- Update the trigger functions to handle phone as primary key
CREATE OR REPLACE FUNCTION public.handle_new_passenger_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only create passenger profile for regular users (not drivers) and if phone exists
  IF (NEW.raw_user_meta_data->>'user_type' IS NULL OR NEW.raw_user_meta_data->>'user_type' = 'passenger') 
     AND (NEW.phone IS NOT NULL OR NEW.raw_user_meta_data->>'phone' IS NOT NULL) THEN
    INSERT INTO public.passengers (phone, user_id, name, email)
    VALUES (
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      NEW.email
    )
    ON CONFLICT (phone) DO NOTHING; -- Handle potential duplicates gracefully
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_driver_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only create driver profile when user_type is explicitly 'driver' and phone exists
  IF NEW.raw_user_meta_data->>'user_type' = 'driver' 
     AND (NEW.phone IS NOT NULL OR NEW.raw_user_meta_data->>'phone' IS NOT NULL) THEN
    INSERT INTO public.drivers (phone, user_id, name, email)
    VALUES (
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Driver'),
      NEW.email
    )
    ON CONFLICT (phone) DO NOTHING; -- Handle potential duplicates gracefully
  END IF;
  RETURN NEW;
END;
$function$;
