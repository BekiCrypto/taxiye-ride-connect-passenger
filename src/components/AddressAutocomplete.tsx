
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building2, Home } from 'lucide-react';
import { getGoogleMapsService, PlaceAutocomplete, PlaceDetails } from '@/services/googleMapsService';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  className
}) => {
  const [predictions, setPredictions] = useState<PlaceAutocomplete[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      const service = getGoogleMapsService();
      if (!service || !value.trim()) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await service.getPlacePredictions(value);
        setPredictions(results);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowPredictions(true);
  };

  const handlePredictionClick = async (prediction: PlaceAutocomplete) => {
    const service = getGoogleMapsService();
    if (!service) return;

    setIsLoading(true);
    try {
      const placeDetails = await service.getPlaceDetails(prediction.place_id);
      if (placeDetails) {
        onChange(placeDetails.formatted_address);
        onPlaceSelect(placeDetails);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceIcon = (types: string[]) => {
    if (types.some(type => ['establishment', 'point_of_interest', 'store', 'restaurant'].includes(type))) {
      return <Building2 className="w-4 h-4 text-blue-500" />;
    }
    if (types.some(type => ['street_address', 'premise'].includes(type))) {
      return <Home className="w-4 h-4 text-green-500" />;
    }
    return <MapPin className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        onFocus={() => setShowPredictions(true)}
        onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
      />
      
      {showPredictions && predictions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border-gray-700 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="flex items-start p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
                onClick={() => handlePredictionClick(prediction)}
              >
                <div className="mr-3 mt-0.5 flex-shrink-0">
                  {getPlaceIcon(prediction.types)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                  {prediction.types.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1 capitalize">
                      {prediction.types.slice(0, 2).join(', ').replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
