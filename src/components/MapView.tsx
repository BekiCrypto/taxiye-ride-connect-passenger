import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, ArrowUpDown } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface MapViewProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  activeInput: 'pickup' | 'dropoff';
  onActiveInputChange: (input: 'pickup' | 'dropoff') => void;
}

const MapView: React.FC<MapViewProps> = ({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  activeInput,
  onActiveInputChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null);
  const { isLoaded, error } = useGoogleMaps();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('Current location obtained:', location);
          setCurrentLocation(location);
          
          // Set pickup to current location if empty
          if (!pickup && isLoaded) {
            reverseGeocode(location).then((address) => {
              if (address) {
                console.log('Setting pickup to current location:', address);
                onPickupChange(address);
              }
            });
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Set default location to Addis Ababa if geolocation fails
          const defaultLocation = { lat: 9.0320, lng: 38.7469 };
          setCurrentLocation(defaultLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, [pickup, onPickupChange, isLoaded]);

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current && window.google) {
      const defaultCenter = currentLocation || { lat: 9.0320, lng: 38.7469 }; // Addis Ababa
      
      console.log('Initializing Google Map at:', defaultCenter);
      
      try {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 15,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry.fill",
              "stylers": [{"color": "#1f2937"}]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{"color": "#374151"}]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{"color": "#111827"}]
            }
          ]
        });

        // Add click listener to map
        mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const location = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            
            console.log('Map clicked at:', location);
            
            reverseGeocode(location).then((address) => {
              if (address) {
                if (activeInput === 'pickup') {
                  onPickupChange(address);
                } else {
                  onDropoffChange(address);
                }
              }
            });
          }
        });
        
        console.log('Google Map initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Map:', error);
      }
    }
  }, [isLoaded, currentLocation, activeInput, onPickupChange, onDropoffChange]);

  // Reverse geocode function
  const reverseGeocode = async (location: { lat: number; lng: number }): Promise<string | null> => {
    if (!window.google) {
      console.error('Google Maps not loaded');
      return null;
    }
    
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  };

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !window.google) return;

    // Handle pickup marker
    if (pickup && currentLocation) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setMap(null);
      }
      
      pickupMarkerRef.current = new window.google.maps.Marker({
        position: currentLocation,
        map: mapInstanceRef.current,
        title: 'Pickup Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      });
    }

    // Handle dropoff marker
    if (dropoff) {
      // For now, we'll use a placeholder location for dropoff
      // In a real implementation, you'd geocode the dropoff address
      const dropoffLocation = { lat: 9.0420, lng: 38.7569 }; // Placeholder
      
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setMap(null);
      }
      
      dropoffMarkerRef.current = new window.google.maps.Marker({
        position: dropoffLocation,
        map: mapInstanceRef.current,
        title: 'Dropoff Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      });
    }
  }, [pickup, dropoff, isLoaded, currentLocation]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(15);
          }
          
          reverseGeocode(location).then((address) => {
            if (address) {
              onPickupChange(address);
            }
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  const handleToggleInput = () => {
    onActiveInputChange(activeInput === 'pickup' ? 'dropoff' : 'pickup');
  };

  const handleSwapLocations = () => {
    const tempPickup = pickup;
    onPickupChange(dropoff);
    onDropoffChange(tempPickup);
  };

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700 h-64 flex items-center justify-center">
        <p className="text-gray-400">Map service unavailable</p>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="bg-gray-800 border-gray-700 h-64 flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <div className="relative">
        <div ref={mapRef} className="w-full h-64" />
        
        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {/* Toggle Active Input */}
          <Button
            size="sm"
            onClick={handleToggleInput}
            className={`${
              activeInput === 'pickup' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${
              activeInput === 'pickup' ? 'bg-white' : 'bg-white'
            }`} />
            {activeInput === 'pickup' ? 'Set Pickup' : 'Set Destination'}
          </Button>

          {/* Swap Locations */}
          {pickup && dropoff && (
            <Button
              size="sm"
              onClick={handleSwapLocations}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Current Location Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCurrentLocation}
          className="absolute bottom-4 right-4 bg-gray-700 hover:bg-gray-600 text-yellow-500"
        >
          <Navigation className="w-4 h-4" />
        </Button>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Tap map to set {activeInput === 'pickup' ? 'pickup' : 'destination'}
        </div>
      </div>
    </Card>
  );
};

export default MapView;
