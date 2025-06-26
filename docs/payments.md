
# Payment Integration Documentation

## Overview

The Taxiye Passenger App supports multiple payment methods to provide flexible payment options for users across different financial systems in Ethiopia and internationally.

## Supported Payment Methods

### 1. Wallet Payment
- **Purpose**: Internal wallet system for quick payments
- **Features**: Balance management, transaction history
- **Integration**: Supabase database storage

### 2. Cash Payment
- **Purpose**: Traditional cash payment to driver
- **Features**: No processing fees, driver collection
- **Integration**: Status tracking only

### 3. Telebirr Payment
- **Purpose**: Ethiopia's national mobile money service
- **Features**: Mobile money integration, instant payment
- **Integration**: Telebirr API (simulated)

### 4. Card Payment
- **Purpose**: Credit/Debit card processing
- **Features**: International card support, secure processing
- **Integration**: Stripe Payment Gateway

### 5. Bank Transfer
- **Purpose**: Direct bank account transfers
- **Features**: Multiple Ethiopian banks, ACH processing
- **Integration**: Banking APIs (simulated)

## Payment Architecture

### Component Structure

```
PaymentSelector (Main Component)
├── WalletPayment
├── CashPayment
├── TelebirrPayment
├── CardPayment
└── BankTransferPayment
```

### Payment Flow

```
User Selection → Payment Processing → Confirmation → Ride Completion
```

## Implementation Details

### Payment Selector Component

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

const PaymentSelector = ({ onBack, amount, rideDetails }: PaymentSelectorProps) => {
  const handlePayment = (method: string, paymentAmount: number, details?: any) => {
    // Process payment logic
    console.log('Payment processed:', { method, amount: paymentAmount, details });
    
    toast({
      title: "Payment Successful!",
      description: `Payment of ETB ${paymentAmount.toFixed(2)} completed via ${method}`,
    });
  };

  return (
    // Payment method selection UI
  );
};
```

### Individual Payment Components

#### Wallet Payment

```typescript
interface WalletPaymentProps {
  onPayment: (method: string, amount: number) => void;
  amount: number;
  balance?: number;
}

const WalletPayment = ({ onPayment, amount, balance = 450 }: WalletPaymentProps) => {
  const canPay = balance >= amount;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        {/* Wallet balance display and payment button */}
        <Button 
          onClick={() => onPayment('wallet', amount)}
          disabled={!canPay}
          className={canPay ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600'}
        >
          {canPay ? 'Pay with Wallet' : 'Insufficient Balance'}
        </Button>
      </CardContent>
    </Card>
  );
};
```

#### Telebirr Payment

```typescript
const TelebirrPayment = ({ onPayment, amount }: TelebirrPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate Telebirr API call
    setTimeout(() => {
      onPayment('telebirr', amount, { phoneNumber });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    // Telebirr payment form
  );
};
```

#### Card Payment

```typescript
const CardPayment = ({ onPayment, amount }: CardPaymentProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    // Simulate card processing
    setTimeout(() => {
      onPayment('card', amount, { 
        cardNumber: cardNumber.slice(-4), 
        expiryDate 
      });
    }, 3000);
  };

  return (
    // Card payment form
  );
};
```

## Wallet System

### Wallet Top-Up Methods

#### Telebirr Top-Up

```typescript
const TelebirrTopUp = () => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleTopUp = async () => {
    // Simulate Telebirr top-up
    setTimeout(() => {
      toast({
        title: "Top-up Successful!",
        description: `ETB ${amount} added to your wallet via Telebirr`,
      });
    }, 2000);
  };

  return (
    // Top-up interface
  );
};
```

#### Bank Transfer Top-Up

```typescript
const BankTransferTopUp = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('');

  const banks = [
    { id: 'cbe', name: 'Commercial Bank of Ethiopia' },
    { id: 'dashen', name: 'Dashen Bank' },
    { id: 'awash', name: 'Awash Bank' },
    // ... more banks
  ];

  return (
    // Bank selection and transfer interface
  );
};
```

### Wallet Transaction Management

```typescript
// Add transaction to database
const addWalletTransaction = async (transaction: {
  type: 'top_up' | 'payment' | 'refund';
  amount: number;
  source: string;
  description: string;
}) => {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert({
      driver_phone_ref: userPhone,
      type: transaction.type,
      amount: transaction.amount,
      source: transaction.source,
      description: transaction.description,
      status: 'completed'
    });

  return { data, error };
};
```

## Stripe Integration

### Setup and Configuration

```typescript
// Stripe configuration
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
```

### Payment Intent Creation

```typescript
const createPaymentIntent = async (amount: number, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
```

### Card Payment Processing

```typescript
const processCardPayment = async (paymentMethodId: string, amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Card payment failed:', error);
    throw error;
  }
};
```

## Ethiopian Payment Systems

### Telebirr Integration

```typescript
// Telebirr API integration (simulated)
const TelebirrAPI = {
  async initiatePayment(phoneNumber: string, amount: number) {
    // In real implementation, this would call Telebirr API
    const response = await fetch('/api/telebirr/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, amount }),
    });

    return response.json();
  },

  async checkPaymentStatus(transactionId: string) {
    const response = await fetch(`/api/telebirr/status/${transactionId}`);
    return response.json();
  }
};
```

### Banking System Integration

```typescript
// Ethiopian banking system integration
const EthiopianBanks = {
  cbe: {
    name: 'Commercial Bank of Ethiopia',
    code: 'CBE',
    api: '/api/banks/cbe'
  },
  dashen: {
    name: 'Dashen Bank',
    code: 'DASH',
    api: '/api/banks/dashen'
  },
  awash: {
    name: 'Awash Bank',
    code: 'AWASH',
    api: '/api/banks/awash'
  }
};

const processBankTransfer = async (bankCode: string, amount: number, accountNumber: string) => {
  const bank = EthiopianBanks[bankCode];
  
  const response = await fetch(bank.api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, accountNumber }),
  });

  return response.json();
};
```

## Security Implementation

### Payment Data Protection

```typescript
// Secure payment data handling
const sanitizePaymentData = (paymentData: any) => {
  // Remove sensitive information before logging
  const { cardNumber, cvv, pin, ...safeData } = paymentData;
  
  return {
    ...safeData,
    cardNumber: cardNumber ? `****${cardNumber.slice(-4)}` : undefined
  };
};
```

### Transaction Verification

```typescript
const verifyTransaction = async (transactionId: string, amount: number) => {
  // Verify transaction with payment provider
  const transaction = await getTransactionFromProvider(transactionId);
  
  if (transaction.amount !== amount) {
    throw new Error('Transaction amount mismatch');
  }
  
  if (transaction.status !== 'completed') {
    throw new Error('Transaction not completed');
  }
  
  return transaction;
};
```

## Error Handling

### Payment Error Types

```typescript
enum PaymentError {
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  INVALID_CARD = 'invalid_card',
  NETWORK_ERROR = 'network_error',
  PROVIDER_ERROR = 'provider_error',
  TIMEOUT = 'timeout'
}

const handlePaymentError = (error: PaymentError, context?: any) => {
  switch (error) {
    case PaymentError.INSUFFICIENT_FUNDS:
      return 'Insufficient funds in your account';
    case PaymentError.INVALID_CARD:
      return 'Invalid card information';
    case PaymentError.NETWORK_ERROR:
      return 'Network connection error. Please try again.';
    default:
      return 'Payment failed. Please try again.';
  }
};
```

### Retry Logic

```typescript
const retryPayment = async (paymentFunction: () => Promise<any>, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await paymentFunction();
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw lastError;
};
```

## Testing

### Payment Testing

```typescript
// Mock payment providers for testing
const MockPaymentProvider = {
  processPayment: jest.fn().mockResolvedValue({
    success: true,
    transactionId: 'mock-transaction-123',
    amount: 100
  }),
  
  getTransactionStatus: jest.fn().mockResolvedValue({
    status: 'completed',
    amount: 100
  })
};

describe('Payment Processing', () => {
  it('should process wallet payment successfully', async () => {
    const result = await processWalletPayment(100);
    expect(result.success).toBe(true);
    expect(result.amount).toBe(100);
  });
});
```

## Monitoring and Analytics

### Payment Metrics

```typescript
// Track payment success rates
const trackPaymentMetrics = {
  success: (method: string, amount: number) => {
    // Analytics tracking
    console.log(`Payment success: ${method}, Amount: ${amount}`);
  },
  
  failure: (method: string, error: string) => {
    // Error tracking
    console.error(`Payment failure: ${method}, Error: ${error}`);
  }
};
```

### Performance Monitoring

```typescript
// Monitor payment processing times
const measurePaymentTime = async (paymentFunction: () => Promise<any>) => {
  const startTime = Date.now();
  
  try {
    const result = await paymentFunction();
    const endTime = Date.now();
    
    console.log(`Payment processed in ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = Date.now();
    console.error(`Payment failed after ${endTime - startTime}ms`);
    throw error;
  }
};
```

## Best Practices

### Security Best Practices

1. **Never store sensitive payment data** (card numbers, CVV, PINs)
2. **Use HTTPS** for all payment communications
3. **Implement proper validation** for all payment inputs
4. **Use tokenization** for recurring payments
5. **Implement fraud detection** mechanisms

### User Experience Best Practices

1. **Provide clear payment options** with descriptions
2. **Show payment progress** during processing
3. **Handle errors gracefully** with helpful messages
4. **Implement payment confirmations** and receipts
5. **Allow payment method management** for users

### Performance Best Practices

1. **Implement payment caching** where appropriate
2. **Use asynchronous processing** for slow operations
3. **Implement proper timeout handling**
4. **Optimize payment form rendering**
5. **Use connection pooling** for payment APIs
