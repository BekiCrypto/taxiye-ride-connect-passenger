
-- Create a separate passengers table
CREATE TABLE public.passengers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on passengers table
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for passengers
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

-- Update the rides table to properly reference both drivers and passengers
ALTER TABLE public.rides 
ADD COLUMN passenger_id uuid REFERENCES public.passengers(id);

-- Create a function to handle new passenger users
CREATE OR REPLACE FUNCTION public.handle_new_passenger_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only create passenger profile for regular users (not drivers)
  IF NEW.raw_user_meta_data->>'user_type' IS NULL OR NEW.raw_user_meta_data->>'user_type' = 'passenger' THEN
    INSERT INTO public.passengers (user_id, name, phone, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Update the driver function to only create driver profiles when specified
CREATE OR REPLACE FUNCTION public.handle_new_driver_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only create driver profile when user_type is explicitly 'driver'
  IF NEW.raw_user_meta_data->>'user_type' = 'driver' THEN
    INSERT INTO public.drivers (user_id, name, phone, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Driver'),
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger for passenger users
CREATE TRIGGER on_auth_passenger_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_passenger_user();

-- Update the existing driver trigger
DROP TRIGGER IF EXISTS on_auth_driver_created ON auth.users;
CREATE TRIGGER on_auth_driver_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_driver_user();
