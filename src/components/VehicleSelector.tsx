
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Truck, Bike } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
}

interface VehicleSelectorProps {
  selectedVehicle: string;
  onVehicleChange: (vehicleId: string) => void;
}

const vehicleTypes: VehicleType[] = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Affordable rides',
    price: 'ETB 15/km',
    icon: <Car className="w-4 h-4" />
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'More space & comfort',
    price: 'ETB 25/km',
    icon: <Car className="w-4 h-4" />
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'High-end vehicles',
    price: 'ETB 40/km',
    icon: <Car className="w-4 h-4" />
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'For packages',
    price: 'ETB 12/km',
    icon: <Truck className="w-4 h-4" />
  },
  {
    id: 'bike',
    name: 'Bike',
    description: 'Quick & eco-friendly',
    price: 'ETB 8/km',
    icon: <Bike className="w-4 h-4" />
  }
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicle,
  onVehicleChange
}) => {
  const selectedVehicleInfo = vehicleTypes.find(v => v.id === selectedVehicle) || vehicleTypes[0];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedVehicleInfo.icon}
            <div>
              <p className="text-white font-medium">{selectedVehicleInfo.name}</p>
              <p className="text-gray-400 text-sm">{selectedVehicleInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <p className="text-yellow-500 font-semibold">{selectedVehicleInfo.price}</p>
            <Select value={selectedVehicle} onValueChange={onVehicleChange}>
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {vehicleTypes.map((vehicle) => (
                  <SelectItem 
                    key={vehicle.id} 
                    value={vehicle.id}
                    className="text-white hover:bg-gray-600"
                  >
                    <div className="flex items-center space-x-2">
                      {vehicle.icon}
                      <span>{vehicle.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
