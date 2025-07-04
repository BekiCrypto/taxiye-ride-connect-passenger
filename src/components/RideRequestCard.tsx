
import React, { useState } from 'react';
import { Car, Users, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RideRequestCardProps {
  pickup: string;
  dropoff: string;
}

const RideRequestCard = ({ pickup, dropoff }: RideRequestCardProps) => {
  const [selectedRideType, setSelectedRideType] = useState('mini');
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  const rideTypes = [
    {
      id: 'mini',
      name: 'Taxiye Mini',
      icon: Car,
      price: 'ETB 85',
      time: '3 min',
      description: 'Affordable rides',
    },
    {
      id: 'xl',
      name: 'Taxiye XL',
      icon: Users,
      price: 'ETB 120',
      time: '5 min',
      description: 'Extra space for groups',
    },
    {
      id: 'premium',
      name: 'Taxiye Premium',
      icon: Crown,
      price: 'ETB 180',
      time: '4 min',
      description: 'Luxury experience',
    },
  ];

  const canRequest = pickup.trim() && dropoff.trim();

  const handleRideRequest = async () => {
    if (!canRequest) return;

    setIsRequesting(true);
    
    try {
      // Simulate ride request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedRide = rideTypes.find(r => r.id === selectedRideType);
      toast({
        title: "Ride Requested!",
        description: `Your ${selectedRide?.name} has been requested. Looking for nearby drivers...`,
      });
      
      console.log('Ride requested:', {
        pickup,
        dropoff,
        rideType: selectedRideType,
        fare: selectedRide?.price
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

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-white">Choose Ride Type</h3>
        
        <div className="space-y-3">
          {rideTypes.map((ride) => {
            const Icon = ride.icon;
            const isSelected = selectedRideType === ride.id;
            
            return (
              <div
                key={ride.id}
                onClick={() => setSelectedRideType(ride.id)}
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
                      <Icon className={`w-5 h-5 ${
                        isSelected ? 'text-black' : 'text-white'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{ride.name}</p>
                      <p className="text-sm text-gray-400">{ride.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-500">{ride.price}</p>
                    <p className="text-sm text-gray-400">{ride.time} away</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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

        {canRequest && !isRequesting && (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Estimated fare: <span className="text-yellow-500 font-medium">
                {rideTypes.find(r => r.id === selectedRideType)?.price}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideRequestCard;
