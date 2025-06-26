
# Component Documentation

## Core Components

### Home Components

#### HomeHeader
Location: `src/components/home/HomeHeader.tsx`

**Purpose**: Displays the main header with user information and notifications.

**Props**:
```typescript
interface HomeHeaderProps {
  session: Session | null;
  userProfile: any;
  isRideInProgress: boolean;
  rideData: {
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  } | null;
}
```

**Features**:
- User greeting and ride status
- Notification bell icon
- Taxiye logo display
- Dynamic content based on ride state

#### HomeContent
Location: `src/components/home/HomeContent.tsx`

**Purpose**: Main content area for the home page including map, location selector, and vehicle selection.

**Props**:
```typescript
interface HomeContentProps {
  session: Session | null;
  userProfile: any;
  pickup: string;
  dropoff: string;
  activeInput: 'pickup' | 'dropoff';
  selectedVehicle: string;
  isRideInProgress: boolean;
  rideProgress: number;
  rideData: RideData | null;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onActiveInputChange: (input: 'pickup' | 'dropoff') => void;
  onVehicleChange: (vehicle: string) => void;
  onRideStart: (rideInfo: RideData) => void;
  onPaymentClick: () => void;
}
```

### Wallet Components

#### WalletContent
Location: `src/components/wallet/WalletContent.tsx`

**Purpose**: Wallet dashboard showing balance and transaction history.

**Features**:
- Current balance display
- Top-up options (Telebirr, Bank Transfer, Card)
- Recent transaction history
- Accordion-style organization

#### TelebirrTopUp
Location: `src/components/wallet/TelebirrTopUp.tsx`

**Purpose**: Telebirr mobile money top-up functionality.

**Features**:
- Phone number input
- Amount selection
- Processing simulation
- Success/error handling

### Payment Components

#### PaymentSelector
Location: `src/components/payment/PaymentSelector.tsx`

**Purpose**: Main payment method selection interface.

**Props**:
```typescript
interface PaymentSelectorProps {
  onBack: () => void;
  amount: number;
  rideDetails?: {
    pickup: string;
    dropoff: string;
    vehicleType: string;
  };
}
```

**Features**:
- Multiple payment options
- Ride summary display
- Payment processing
- Success/failure handling

#### Individual Payment Components

Each payment method has its own component:

- **WalletPayment**: Wallet balance payment
- **CashPayment**: Cash payment to driver
- **TelebirrPayment**: Telebirr mobile money
- **CardPayment**: Credit/debit card payment
- **BankTransferPayment**: Direct bank transfer

### Profile Components

#### ProfileContent
Location: `src/components/profile/ProfileContent.tsx`

**Purpose**: User profile management and navigation.

**Features**:
- User profile display
- Profile management options
- Referral system integration
- Authentication state handling

### Referral Components

#### ReferralEarnCard
Location: `src/components/referral/ReferralEarnCard.tsx`

**Purpose**: Referral program interface for earning rewards.

**Features**:
- Referral code generation
- Sharing functionality
- Earnings tracking
- How-it-works explanation

#### CouponManager
Location: `src/components/referral/CouponManager.tsx`

**Purpose**: Manages earned coupons and redemption.

**Features**:
- Coupon display
- Redemption interface
- Coupon history
- Balance updates

#### ReferralSettings
Location: `src/components/referral/ReferralSettings.tsx`

**Purpose**: Configuration settings for the referral system.

**Features**:
- Configurable bonus amounts
- Coupon type settings
- Marketing message templates
- Easy customization for marketing team

## Shared Components

### BottomNavigation
Location: `src/components/BottomNavigation.tsx`

**Purpose**: Main navigation component for the app.

**Features**:
- Four main tabs: Home, Wallet, Trips, Profile
- Active state management
- Icon-based navigation
- Responsive design

### LocationSelector
Location: `src/components/LocationSelector.tsx`

**Purpose**: Pickup and dropoff location selection.

**Features**:
- Google Maps integration
- Autocomplete functionality
- Current location detection
- Saved addresses

### MapView
Location: `src/components/MapView.tsx`

**Purpose**: Interactive map display for ride booking.

**Features**:
- Google Maps integration
- Route visualization
- Real-time tracking
- Driver location updates

### VehicleSelector
Location: `src/components/VehicleSelector.tsx`

**Purpose**: Vehicle type selection for rides.

**Features**:
- Multiple vehicle options
- Pricing display
- Availability status
- Fare estimation

## UI Components (shadcn/ui)

### Base Components

- **Button**: Customizable button component
- **Card**: Container component for content
- **Input**: Form input component
- **Select**: Dropdown selection component
- **Accordion**: Collapsible content sections

### Form Components

- **Form**: Form wrapper with validation
- **Label**: Form field labels
- **Textarea**: Multi-line text input
- **Checkbox**: Checkbox input
- **Radio Group**: Radio button selection

### Feedback Components

- **Toast**: Notification messages
- **Alert**: Important announcements
- **Dialog**: Modal dialogs
- **Sheet**: Slide-out panels

### Navigation Components

- **Tabs**: Tabbed content organization
- **Breadcrumb**: Navigation trail
- **Pagination**: Page navigation

## Component Best Practices

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  // prop definitions
}

// 3. Component Definition
const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 4. Hooks and State
  const [state, setState] = useState();
  
  // 5. Event Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 6. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 7. Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

// 8. Export
export default Component;
```

### Naming Conventions

- **Components**: PascalCase (`HomeHeader`)
- **Props**: camelCase (`onPaymentClick`)
- **State**: camelCase (`isLoading`)
- **Handlers**: camelCase with 'handle' prefix (`handleSubmit`)

### Performance Optimization

- Use `React.memo` for expensive components
- Implement proper dependency arrays in `useEffect`
- Avoid inline functions in render
- Use `useCallback` for event handlers when needed

### Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain proper heading hierarchy
- Use semantic HTML elements
