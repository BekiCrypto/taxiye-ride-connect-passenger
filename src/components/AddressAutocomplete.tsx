
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
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
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border-gray-700 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="flex items-center p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                onClick={() => handlePredictionClick(prediction)}
              >
                <MapPin className="w-4 h-4 text-yellow-500 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
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
