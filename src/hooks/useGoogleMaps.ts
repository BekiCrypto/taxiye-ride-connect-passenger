
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initializeGoogleMapsService } from '@/services/googleMapsService';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        // Get the API key from Supabase secrets
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GOOGLE_MAPS_API_KEY' }
        });

        if (error) {
          throw new Error('Failed to get Google Maps API key');
        }

        if (!data?.value) {
          throw new Error('Google Maps API key not found');
        }

        // Initialize the Google Maps service
        await initializeGoogleMapsService(data.value);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error initializing Google Maps:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Google Maps');
      }
    };

    initializeGoogleMaps();
  }, []);

  return { isLoaded, error };
};
