
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Bike } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  icon: React.ReactNode;
}

interface VehicleSelectorProps {
  selectedVehicle: string;
  onVehicleChange: (vehicleId: string) => void;
  pickup?: string;
  dropoff?: string;
}

const vehicleTypes: VehicleType[] = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Affordable rides',
    basePrice: 25,
    pricePerKm: 15,
    icon: <Car className="w-4 h-4" />
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'More space & comfort',
    basePrice: 35,
    pricePerKm: 25,
    icon: <Car className="w-4 h-4" />
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'High-end vehicles',
    basePrice: 50,
    pricePerKm: 40,
    icon: <Car className="w-4 h-4" />
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'For packages',
    basePrice: 20,
    pricePerKm: 12,
    icon: <Truck className="w-4 h-4" />
  },
  {
    id: 'bike',
    name: 'Bike',
    description: 'Quick & eco-friendly',
    basePrice: 15,
    pricePerKm: 8,
    icon: <Bike className="w-4 h-4" />
  }
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicle,
  pickup,
  dropoff
}) => {
  const selectedVehicleInfo = vehicleTypes.find(v => v.id === selectedVehicle) || vehicleTypes[0];
  
  // Estimate distance (placeholder - in real app you'd calculate actual distance)
  const estimatedDistance = pickup && dropoff ? 8.5 : 0; // km
  
  const formatPrice = (basePrice: number, pricePerKm: number) => {
    if (estimatedDistance > 0) {
      const totalFare = basePrice + (pricePerKm * estimatedDistance);
      return `ETB ${Math.round(totalFare)}`;
    }
    return `ETB ${pricePerKm}/km`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-yellow-500">
              {selectedVehicleInfo.icon}
            </div>
            <div>
              <p className="text-white font-medium">{selectedVehicleInfo.name}</p>
              <p className="text-gray-400 text-sm">{selectedVehicleInfo.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-500 font-semibold">
              {formatPrice(selectedVehicleInfo.basePrice, selectedVehicleInfo.pricePerKm)}
            </p>
            {estimatedDistance > 0 && (
              <p className="text-gray-400 text-xs">
                {estimatedDistance} km
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
