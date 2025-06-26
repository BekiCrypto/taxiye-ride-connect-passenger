
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <CardContent className="p-4">
        {/* Toggle Buttons */}
        <div className="flex space-x-2 mb-3">
          <Button
            size="sm"
            variant={activeInput === 'pickup' ? 'default' : 'secondary'}
            onClick={() => onActiveInputChange('pickup')}
            className={`flex-1 ${
              activeInput === 'pickup' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Pickup
          </Button>
          <Button
            size="sm"
            variant={activeInput === 'dropoff' ? 'default' : 'secondary'}
            onClick={() => onActiveInputChange('dropoff')}
            className={`flex-1 ${
              activeInput === 'dropoff' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            Destination
          </Button>
        </div>

        {/* Single Input Field */}
        <div className="relative">
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 w-3 h-3 rounded-full ${
            activeInput === 'pickup' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          
          {isLoaded && !error ? (
            <AddressAutocomplete
              value={activeInput === 'pickup' ? pickup : dropoff}
              onChange={activeInput === 'pickup' ? onPickupChange : onDropoffChange}
              onPlaceSelect={activeInput === 'pickup' ? handlePickupSelect : handleDropoffSelect}
              placeholder={activeInput === 'pickup' ? 'Enter pickup location' : 'Enter destination'}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
            />
          ) : (
            <input
              type="text"
              placeholder={activeInput === 'pickup' ? 'Enter pickup location' : 'Enter destination'}
              value={activeInput === 'pickup' ? pickup : dropoff}
              onChange={(e) => activeInput === 'pickup' ? onPickupChange(e.target.value) : onDropoffChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 rounded-md"
            />
          )}
        </div>

        {/* Show both locations when both are filled */}
        {pickup && dropoff && (
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="truncate">{pickup}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="truncate">{dropoff}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-yellow-500 text-sm text-center mt-2">
            Maps service unavailable. Using basic text input.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
