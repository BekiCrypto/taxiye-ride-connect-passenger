
# Authentication System Documentation

## Overview

The Taxiye Passenger App uses Supabase Auth for comprehensive authentication management, providing secure user registration, login, and session management.

## Authentication Architecture

### Flow Diagram

```
User Registration/Login
        ↓
   Supabase Auth
        ↓
   JWT Token Generation
        ↓
   Row Level Security
        ↓
   Database Access
```

### Supported Authentication Methods

1. **Email/Password** - Primary authentication method
2. **Google OAuth** - Social login integration
3. **Phone Authentication** - SMS-based verification (future)

## Implementation Details

### Authentication Setup

```typescript
// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

### Session Management

```typescript
// Session state management
const [session, setSession] = useState<Session | null>(null);
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

## Authentication Flows

### User Registration

```typescript
const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        name: userData.name,
        phone: userData.phone,
        user_type: 'passenger'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
```

### User Login

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
```

### Google OAuth

```typescript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
```

### Logout

```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Clear local state
  setSession(null);
  setUser(null);
};
```

## User Profile Management

### Profile Creation Trigger

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

### Profile Data Access

```typescript
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('passengers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
```

## Security Implementation

### Row Level Security (RLS)

```sql
-- Passengers can only access their own data
CREATE POLICY "Users can view own profile" ON passengers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON passengers
  FOR UPDATE USING (auth.uid() = user_id);

-- Rides access control
CREATE POLICY "Users can view own rides" ON rides
  FOR SELECT USING (
    passenger_phone_ref IN (
      SELECT phone FROM passengers WHERE user_id = auth.uid()
    )
  );
```

### JWT Token Validation

```typescript
const validateSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error('Invalid session');
  }
  
  return session;
};
```

## Error Handling

### Common Authentication Errors

```typescript
const handleAuthError = (error: any) => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Incorrect email or password';
    case 'User already registered':
      return 'An account with this email already exists';
    case 'Email not confirmed':
      return 'Please check your email and confirm your account';
    case 'Signup requires a valid password':
      return 'Password must be at least 6 characters';
    default:
      return 'Authentication failed. Please try again.';
  }
};
```

### Error Response Format

```typescript
interface AuthError {
  code: string;
  message: string;
  status: number;
}
```

## Session Persistence

### Local Storage Configuration

```typescript
// Configure session persistence
const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
```

### Session Refresh Handling

```typescript
// Automatic token refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed:', session?.access_token);
  }
});
```

## Protected Routes

### Route Protection Implementation

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};
```

### Authentication Context

```typescript
const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});
```

## Best Practices

### Security Best Practices

1. **Always validate sessions** server-side for sensitive operations
2. **Use HTTPS** for all authentication requests
3. **Implement proper logout** to clear all session data
4. **Handle token expiration** gracefully
5. **Use secure storage** for sensitive data

### User Experience Best Practices

1. **Provide clear error messages** for authentication failures
2. **Implement loading states** during authentication
3. **Remember user preference** for login method
4. **Offer password reset** functionality
5. **Support social login** for convenience

### Performance Optimization

1. **Cache user data** appropriately
2. **Implement proper session checks** to avoid unnecessary API calls
3. **Use optimistic updates** where possible
4. **Implement proper error boundaries** for auth failures

## Configuration

### Environment Variables

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Dashboard Configuration

1. **Authentication Providers**
   - Email: Enabled
   - Google: Configured with OAuth credentials
   - Phone: Disabled (future feature)

2. **URL Configuration**
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`

3. **Email Templates**
   - Confirmation email template
   - Password reset email template
   - Magic link email template

### Google OAuth Setup

1. **Google Cloud Console**
   - Create OAuth 2.0 Client ID
   - Configure authorized origins
   - Set up consent screen

2. **Supabase Configuration**
   - Add Google Client ID and Secret
   - Configure redirect URLs
   - Enable Google provider

## Testing

### Authentication Testing

```typescript
// Test authentication flow
describe('Authentication', () => {
  it('should sign up user successfully', async () => {
    const result = await signUp('test@example.com', 'password123', {
      name: 'Test User',
      phone: '+1234567890'
    });
    
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('test@example.com');
  });
  
  it('should sign in user successfully', async () => {
    const result = await signIn('test@example.com', 'password123');
    
    expect(result.session).toBeDefined();
    expect(result.user?.email).toBe('test@example.com');
  });
});
```

### Integration Testing

```typescript
// Test protected route access
describe('Protected Routes', () => {
  it('should redirect unauthenticated users', async () => {
    render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
    
    await waitFor(() => {
      expect(screen.getByText('Please sign in')).toBeInTheDocument();
    });
  });
});
```
