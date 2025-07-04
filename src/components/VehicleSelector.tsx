
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Users, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  onRideStart?: (rideData: {
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  }) => void;
}

const vehicleTypes: VehicleType[] = [
  {
    id: 'mini',
    name: 'Taxiye Mini',
    description: 'Affordable rides',
    basePrice: 25,
    pricePerKm: 15,
    icon: <Car className="w-5 h-5" />
  },
  {
    id: 'xl',
    name: 'Taxiye XL',
    description: 'Extra space for groups',
    basePrice: 35,
    pricePerKm: 25,
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'premium',
    name: 'Taxiye Premium',
    description: 'Luxury experience',
    basePrice: 50,
    pricePerKm: 40,
    icon: <Crown className="w-5 h-5" />
  }
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicle,
  onVehicleChange,
  pickup,
  dropoff,
  onRideStart
}) => {
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  // Estimate distance (placeholder - in real app you'd calculate actual distance)
  const estimatedDistance = pickup && dropoff ? 8.5 : 0; // km
  
  const formatPrice = (basePrice: number, pricePerKm: number) => {
    if (estimatedDistance > 0) {
      const totalFare = basePrice + (pricePerKm * estimatedDistance);
      return `ETB ${Math.round(totalFare)}`;
    }
    return `ETB ${pricePerKm}/km`;
  };

  const canRequest = pickup?.trim() && dropoff?.trim();

  const handleRideRequest = async () => {
    if (!canRequest) return;

    setIsRequesting(true);
    
    try {
      // Simulate ride request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedRide = vehicleTypes.find(r => r.id === selectedVehicle);
      toast({
        title: "Driver Found!",
        description: `Your ${selectedRide?.name} driver is on the way. Starting your ride...`,
      });
      
      // Simulate ride start after 2 seconds
      setTimeout(() => {
        if (onRideStart) {
          onRideStart({
            vehicleType: selectedRide?.name || 'Taxiye',
            driverName: 'Ahmed Ali',
            estimatedTime: 12
          });
        }
      }, 2000);
      
      console.log('Ride requested:', {
        pickup,
        dropoff,
        rideType: selectedVehicle,
        fare: selectedRide ? formatPrice(selectedRide.basePrice, selectedRide.pricePerKm) : ''
      });
      
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Unable to request ride. Please try again.",
        variant: "destructive",
      });
      console.error('Ride request failed:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const selectedRideType = vehicleTypes.find(r => r.id === selectedVehicle);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4 space-y-4">
        {/* Dropdown Header */}
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-white">Choose Ride Type</h3>
          {isDropdownOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Selected Vehicle Display */}
        {!isDropdownOpen && selectedRideType && (
          <div className="p-4 rounded-lg border border-yellow-500 bg-yellow-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-500">
                  <div className="text-black">
                    {selectedRideType.icon}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-white">{selectedRideType.name}</p>
                  <p className="text-sm text-gray-400">{selectedRideType.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-500">
                  {formatPrice(selectedRideType.basePrice, selectedRideType.pricePerKm)}
                </p>
                {estimatedDistance > 0 && (
                  <p className="text-sm text-gray-400">{Math.ceil(estimatedDistance)} min</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Dropdown Options */}
        {isDropdownOpen && (
          <div className="space-y-3">
            {vehicleTypes.map((ride) => {
              const isSelected = selectedVehicle === ride.id;
              
              return (
                <div
                  key={ride.id}
                  onClick={() => onVehicleChange(ride.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        isSelected ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}>
                        <div className={`${isSelected ? 'text-black' : 'text-white'}`}>
                          {ride.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-white">{ride.name}</p>
                        <p className="text-sm text-gray-400">{ride.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-500">
                        {formatPrice(ride.basePrice, ride.pricePerKm)}
                      </p>
                      {estimatedDistance > 0 && (
                        <p className="text-sm text-gray-400">{Math.ceil(estimatedDistance)} min</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button 
          onClick={handleRideRequest}
          disabled={!canRequest || isRequesting}
          className={`w-full py-3 text-lg font-semibold ${
            canRequest && !isRequesting
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isRequesting 
            ? 'Requesting...' 
            : canRequest 
              ? 'Request Ride' 
              : 'Enter pickup and destination'
          }
        </Button>

        {canRequest && !isRequesting && selectedRideType && (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Estimated fare: <span className="text-yellow-500 font-medium">
                {formatPrice(selectedRideType.basePrice, selectedRideType.pricePerKm)}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
