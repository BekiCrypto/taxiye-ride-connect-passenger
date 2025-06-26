
# Architecture Overview

## System Architecture

The Taxiye Passenger App follows a modern client-server architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │  External APIs  │
│   (React App)   │◄──►│   Backend       │◄──►│  (Google Maps,  │
│                 │    │                 │    │   Stripe, etc.) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Index (Main Route)
├── Pages
│   ├── AuthPage
│   ├── EditProfilePage
│   ├── TripHistoryPage
│   └── NotFound
├── Components
│   ├── home/
│   │   ├── HomeHeader
│   │   └── HomeContent
│   ├── wallet/
│   │   ├── WalletContent
│   │   └── TopUp Components
│   ├── trips/
│   │   └── TripsContent
│   ├── profile/
│   │   └── ProfileContent
│   ├── referral/
│   │   ├── ReferralEarnCard
│   │   └── CouponManager
│   └── payment/
│       └── Payment Components
└── UI Components (shadcn/ui)
```

### State Management

The app uses React's built-in state management with hooks:

- **useState**: Local component state
- **useEffect**: Side effects and lifecycle
- **useContext**: Global state (when needed)
- **Tanstack Query**: Server state management

### Data Flow

1. User interactions trigger state updates
2. State changes trigger re-renders
3. API calls are made through Supabase client
4. Real-time updates via Supabase subscriptions

## Backend Architecture (Supabase)

### Database Schema

```
passengers ──┐
            ├── rides ──┐
drivers ─────┘          ├── support_tickets
                        └── sos_alerts
wallet_transactions
promo_codes ──── promo_redemptions
notifications
documents
```

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. JWT tokens are automatically managed
3. Row Level Security (RLS) enforces data access
4. Session persistence across browser refreshes

### Real-time Features

- Ride status updates
- Driver location tracking
- Notification delivery
- Wallet balance updates

## External Integrations

### Google Maps API
- Geocoding and reverse geocoding
- Route calculation
- Map rendering
- Location services

### Payment Gateways
- **Stripe**: Card payments and wallet top-ups
- **Telebirr**: Mobile money integration
- **Bank Transfer**: Direct bank integration

### Third-party Services
- SMS notifications
- Email services
- Push notifications (future)

## Security Architecture

### Authentication Security
- JWT-based authentication
- Secure session management
- OAuth integration (Google)
- Password hashing (handled by Supabase)

### Data Security
- Row Level Security (RLS) policies
- Encrypted data transmission (HTTPS)
- API key protection
- Environment variable security

### Payment Security
- PCI DSS compliance (via Stripe)
- Tokenization of sensitive data
- Secure payment processing
- Audit trails for transactions

## Performance Considerations

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

### Backend Optimization
- Database indexing
- Query optimization
- Connection pooling
- CDN usage for static assets

### Real-time Performance
- Efficient WebSocket connections
- Selective data subscriptions
- Optimistic updates
- Offline capability (future)

## Scalability Design

### Horizontal Scaling
- Stateless frontend architecture
- Database read replicas
- Load balancing considerations
- CDN distribution

### Vertical Scaling
- Resource optimization
- Memory management
- CPU-intensive task handling
- Database performance tuning
