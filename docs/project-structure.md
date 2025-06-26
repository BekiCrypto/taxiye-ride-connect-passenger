
# Project Structure

## Directory Overview

```
src/
├── components/           # Reusable UI components
│   ├── home/            # Home page components
│   ├── wallet/          # Wallet-related components
│   ├── trips/           # Trip management components
│   ├── profile/         # Profile management components
│   ├── referral/        # Referral system components
│   ├── payment/         # Payment processing components
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase configuration
├── lib/                 # Utility functions
├── services/            # API service functions
└── types/               # TypeScript type definitions
```

## Component Organization

### Feature-Based Structure

Each major feature has its own directory:

```
components/
├── home/
│   ├── HomeHeader.tsx
│   ├── HomeContent.tsx
│   └── index.ts
├── wallet/
│   ├── WalletContent.tsx
│   ├── TelebirrTopUp.tsx
│   ├── BankTransferTopUp.tsx
│   └── CardPaymentTopUp.tsx
└── ...
```

### Component Naming Conventions

- **PascalCase** for component files: `HomeHeader.tsx`
- **camelCase** for utility functions: `useGoogleMaps.ts`
- **kebab-case** for CSS classes: `bg-gray-900`
- **UPPER_CASE** for constants: `API_ENDPOINTS`

## File Structure Details

### Pages Directory

```
pages/
├── Index.tsx           # Main application entry point
└── NotFound.tsx        # 404 error page
```

### Components Directory

```
components/
├── home/
│   ├── HomeHeader.tsx      # Header with user info and notifications
│   └── HomeContent.tsx     # Main home page content
├── wallet/
│   ├── WalletContent.tsx   # Wallet dashboard
│   ├── TelebirrTopUp.tsx   # Telebirr payment integration
│   ├── BankTransferTopUp.tsx # Bank transfer functionality
│   └── CardPaymentTopUp.tsx  # Card payment integration
├── trips/
│   └── TripsContent.tsx    # Trip history and management
├── profile/
│   └── ProfileContent.tsx  # User profile management
├── referral/
│   ├── ReferralEarnCard.tsx    # Referral program UI
│   ├── CouponManager.tsx       # Coupon management
│   └── ReferralSettings.tsx    # Referral configuration
├── payment/
│   ├── PaymentSelector.tsx     # Payment method selection
│   ├── WalletPayment.tsx       # Wallet payment option
│   ├── CashPayment.tsx         # Cash payment option
│   ├── TelebirrPayment.tsx     # Telebirr payment processing
│   ├── CardPayment.tsx         # Card payment processing
│   └── BankTransferPayment.tsx # Bank transfer payment
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── AuthPage.tsx            # Authentication page
├── BottomNavigation.tsx    # Main navigation component
├── EditProfilePage.tsx     # Profile editing
├── LocationSelector.tsx    # Location selection
├── MapView.tsx            # Google Maps integration
├── TripHistoryPage.tsx    # Trip history display
└── VehicleSelector.tsx    # Vehicle type selection
```

### Hooks Directory

```
hooks/
├── use-toast.ts        # Toast notification hook
├── use-mobile.tsx      # Mobile detection hook
└── useGoogleMaps.ts    # Google Maps integration hook
```

### Integrations Directory

```
integrations/
└── supabase/
    ├── client.ts       # Supabase client configuration
    └── types.ts        # Generated TypeScript types
```

### Services Directory

```
services/
└── googleMapsService.ts    # Google Maps API service
```

## Import Structure

### Import Order Convention

1. React and React-related imports
2. Third-party libraries
3. Internal components
4. Internal hooks and utilities
5. Types and interfaces

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
```

### Path Aliases

```typescript
// Configured in tsconfig.json
"@/*": ["./src/*"]

// Usage examples
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
```

## Configuration Files

### Root Level Files

```
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
├── components.json       # shadcn/ui configuration
└── README.md            # Project documentation
```

### Environment Configuration

```
.env.local (not tracked)
├── VITE_SUPABASE_URL
├── VITE_SUPABASE_ANON_KEY
├── VITE_GOOGLE_MAPS_API_KEY
└── VITE_STRIPE_PUBLISHABLE_KEY
```

## Build and Output Structure

### Development Build

```
dist/
├── assets/
│   ├── index-[hash].js    # Main application bundle
│   ├── index-[hash].css   # Compiled CSS
│   └── [chunks]           # Code-split chunks
├── index.html             # Entry HTML file
└── favicon.ico           # Application icon
```

### Production Optimizations

- Tree shaking for unused code elimination
- Code splitting for optimal loading
- Asset optimization and compression
- CSS purging for smaller bundle sizes
