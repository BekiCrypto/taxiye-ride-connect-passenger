
import React from 'react';
import { Button } from '@/components/ui/button';
import LocationSelector from '@/components/LocationSelector';
import MapView from '@/components/MapView';
import VehicleSelector from '@/components/VehicleSelector';
import HomeHeader from './HomeHeader';
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
      <HomeHeader 
        session={session}
        userProfile={userProfile}
        isRideInProgress={isRideInProgress}
        rideData={rideData}
      />

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
