
# API Documentation

## Supabase Integration

### Authentication API

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: `${window.location.origin}/`
  }
});
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

#### Google OAuth
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`
  }
});
```

### Database API

#### Passengers Table

**Create Passenger Profile**
```typescript
const { data, error } = await supabase
  .from('passengers')
  .insert({
    phone: '+251911234567',
    name: 'John Doe',
    email: 'john@example.com',
    user_id: userId
  });
```

**Get Passenger Profile**
```typescript
const { data, error } = await supabase
  .from('passengers')
  .select('*')
  .eq('user_id', userId)
  .single();
```

**Update Passenger Profile**
```typescript
const { data, error } = await supabase
  .from('passengers')
  .update({ name: 'Jane Doe' })
  .eq('user_id', userId);
```

#### Rides Table

**Get Ride History**
```typescript
const { data, error } = await supabase
  .from('rides')
  .select(`
    *,
    drivers(name, plate_number, vehicle_model)
  `)
  .eq('passenger_phone_ref', userPhone)
  .order('created_at', { ascending: false });
```

**Create Ride Request**
```typescript
const { data, error } = await supabase
  .from('rides')
  .insert({
    passenger_phone_ref: userPhone,
    pickup_location: 'Bole, Addis Ababa',
    dropoff_location: 'Piazza, Addis Ababa',
    status: 'pending'
  });
```

**Update Ride Status**
```typescript
const { data, error } = await supabase
  .from('rides')
  .update({ status: 'completed' })
  .eq('id', rideId);
```

#### Wallet Transactions

**Add Wallet Transaction**
```typescript
const { data, error } = await supabase
  .from('wallet_transactions')
  .insert({
    driver_phone_ref: userPhone,
    type: 'top_up',
    amount: 100.00,
    source: 'telebirr',
    description: 'Wallet top-up via Telebirr'
  });
```

**Get Transaction History**
```typescript
const { data, error } = await supabase
  .from('wallet_transactions')
  .select('*')
  .eq('driver_phone_ref', userPhone)
  .order('created_at', { ascending: false });
```

### Real-time Subscriptions

#### Ride Status Updates
```typescript
const subscription = supabase
  .channel('ride-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'rides',
      filter: `passenger_phone_ref=eq.${userPhone}`
    },
    (payload) => {
      console.log('Ride updated:', payload.new);
    }
  )
  .subscribe();
```

#### Notification Updates
```typescript
const subscription = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `driver_phone_ref=eq.${userPhone}`
    },
    (payload) => {
      console.log('New notification:', payload.new);
    }
  )
  .subscribe();
```

## External API Integrations

### Google Maps API

#### Geocoding Service
```typescript
const geocodeAddress = async (address: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );
  return response.json();
};
```

#### Distance Matrix API
```typescript
const calculateDistance = async (origin: string, destination: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`
  );
  return response.json();
};
```

#### Places Autocomplete
```typescript
const getPlaceSuggestions = async (input: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}`
  );
  return response.json();
};
```

### Payment Gateway APIs

#### Stripe Integration

**Create Payment Intent**
```typescript
const createPaymentIntent = async (amount: number) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  return response.json();
};
```

#### Telebirr Integration

**Initiate Payment**
```typescript
const initiateTelebirrPayment = async (phoneNumber: string, amount: number) => {
  const response = await fetch('/api/telebirr-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, amount }),
  });
  return response.json();
};
```

## Error Handling

### Common Error Patterns

```typescript
// Supabase error handling
const handleSupabaseError = (error: any) => {
  if (error.code === 'PGRST116') {
    return 'No data found';
  } else if (error.code === '23505') {
    return 'Duplicate entry';
  }
  return error.message || 'An error occurred';
};

// Network error handling
const handleNetworkError = (error: any) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network connection error';
  }
  return 'Request failed';
};
```

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## API Response Formats

### Success Response
```typescript
interface SuccessResponse<T> {
  data: T;
  status: 'success';
  message?: string;
}
```

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

## Rate Limiting

### Supabase Limits
- **Requests per second**: 100 (free tier)
- **Concurrent connections**: 60 (free tier)
- **Database connections**: 20 (free tier)

### Google Maps API Limits
- **Requests per day**: 28,000 (free tier)
- **Requests per minute**: 1,000

### Best Practices

1. **Implement request debouncing** for autocomplete
2. **Cache frequently accessed data** 
3. **Use connection pooling** for database connections
4. **Implement retry logic** with exponential backoff
5. **Monitor API usage** and set up alerts

## Security Considerations

### API Key Protection
- Store API keys in environment variables
- Use different keys for development and production
- Implement API key rotation

### Data Validation
- Validate all inputs on both client and server
- Use TypeScript for type safety
- Implement proper sanitization

### Authentication
- Use JWT tokens for API authentication
- Implement proper session management
- Use HTTPS for all API communications
