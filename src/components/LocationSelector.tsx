
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationSelectorProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
}

const LocationSelector = ({ pickup, dropoff, onPickupChange, onDropoffChange }: LocationSelectorProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4 space-y-4">
        {/* Pickup Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <Input
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => onPickupChange(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:bg-gray-600"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-gray-600"></div>
        </div>

        {/* Dropoff Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <Input
            placeholder="Where to?"
            value={dropoff}
            onChange={(e) => onDropoffChange(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:bg-gray-600"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
