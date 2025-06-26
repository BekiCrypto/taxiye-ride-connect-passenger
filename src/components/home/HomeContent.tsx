
import React from 'react';
import { Button } from '@/components/ui/button';
import LocationSelector from '@/components/LocationSelector';
import MapView from '@/components/MapView';
import VehicleSelector from '@/components/VehicleSelector';
import { Session } from '@supabase/supabase-js';

interface HomeContentProps {
  session: Session | null;
  userProfile: any;
  pickup: string;
  dropoff: string;
  activeInput: 'pickup' | 'dropoff';
  selectedVehicle: string;
  isRideInProgress: boolean;
  rideProgress: number;
  rideData: {
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  } | null;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onActiveInputChange: (input: 'pickup' | 'dropoff') => void;
  onVehicleChange: (vehicle: string) => void;
  onRideStart: (rideInfo: {
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  }) => void;
  onPaymentClick: () => void;
}

const HomeContent = ({ 
  session, 
  userProfile, 
  pickup, 
  dropoff, 
  activeInput, 
  selectedVehicle, 
  isRideInProgress, 
  rideProgress, 
  rideData,
  onPickupChange,
  onDropoffChange,
  onActiveInputChange,
  onVehicleChange,
  onRideStart,
  onPaymentClick
}: HomeContentProps) => {
  return (
    <div className="space-y-4">
      <MapView
        pickup={pickup}
        dropoff={dropoff}
        onPickupChange={onPickupChange}
        onDropoffChange={onDropoffChange}
        activeInput={activeInput}
        onActiveInputChange={onActiveInputChange}
        isRideInProgress={isRideInProgress}
        rideProgress={rideProgress}
        estimatedTime={rideData?.estimatedTime}
        driverName={rideData?.driverName}
        vehicleType={rideData?.vehicleType}
      />

      {/* Trip Info Display - Show just below map when ride is in progress */}
      {isRideInProgress && rideData && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{rideData.driverName}</h3>
              <p className="text-gray-400 text-sm">{rideData.vehicleType}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-500 font-bold">{rideData.estimatedTime} min</p>
              <p className="text-gray-400 text-sm">ETA</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="truncate">{pickup}</span>
            </div>
            <div className="flex items-center text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
              <span className="truncate">{dropoff}</span>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${rideProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-400 text-sm">{Math.round(rideProgress)}% Complete</p>
        </div>
      )}

      {!isRideInProgress && (
        <LocationSelector
          pickup={pickup}
          dropoff={dropoff}
          onPickupChange={onPickupChange}
          onDropoffChange={onDropoffChange}
          activeInput={activeInput}
          onActiveInputChange={onActiveInputChange}
        />
      )}

      {!isRideInProgress && (
        <VehicleSelector
          selectedVehicle={selectedVehicle}
          onVehicleChange={onVehicleChange}
          pickup={pickup}
          dropoff={dropoff}
          onRideStart={onRideStart}
        />
      )}

      {pickup && dropoff && !isRideInProgress && (
        <Button
          onClick={onPaymentClick}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3"
        >
          Test Payment Options
        </Button>
      )}
    </div>
  );
};

export default HomeContent;
