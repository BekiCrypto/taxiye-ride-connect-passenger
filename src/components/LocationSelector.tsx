
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { PlaceDetails } from '@/services/googleMapsService';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface LocationSelectorProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  activeInput: 'pickup' | 'dropoff';
  onActiveInputChange: (input: 'pickup' | 'dropoff') => void;
}

const LocationSelector = ({ 
  pickup, 
  dropoff, 
  onPickupChange, 
  onDropoffChange,
  activeInput,
  onActiveInputChange
}: LocationSelectorProps) => {
  const { isLoaded, error } = useGoogleMaps();

  const handlePickupSelect = (place: PlaceDetails) => {
    console.log('Pickup location selected:', place);
    onPickupChange(place.formatted_address);
  };

  const handleDropoffSelect = (place: PlaceDetails) => {
    console.log('Dropoff location selected:', place);
    onDropoffChange(place.formatted_address);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4 space-y-4">
        {/* Pickup Location */}
        <div 
          className={`relative cursor-pointer rounded-md transition-colors ${
            activeInput === 'pickup' ? 'bg-gray-700/50' : ''
          }`}
          onClick={() => onActiveInputChange('pickup')}
        >
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          {isLoaded && !error ? (
            <AddressAutocomplete
              value={pickup}
              onChange={onPickupChange}
              onPlaceSelect={handlePickupSelect}
              placeholder="Pickup location"
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
            />
          ) : (
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => onPickupChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 rounded-md"
            />
          )}
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-gray-600"></div>
        </div>

        {/* Dropoff Location */}
        <div 
          className={`relative cursor-pointer rounded-md transition-colors ${
            activeInput === 'dropoff' ? 'bg-gray-700/50' : ''
          }`}
          onClick={() => onActiveInputChange('dropoff')}
        >
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          {isLoaded && !error ? (
            <AddressAutocomplete
              value={dropoff}
              onChange={onDropoffChange}
              onPlaceSelect={handleDropoffSelect}
              placeholder="Where to?"
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
            />
          ) : (
            <input
              type="text"
              placeholder="Where to?"
              value={dropoff}
              onChange={(e) => onDropoffChange(e.target.value)}
              className="w-full pl-10 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 rounded-md"
            />
          )}
        </div>

        {error && (
          <div className="text-yellow-500 text-sm text-center">
            Maps service unavailable. Using basic text input.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
