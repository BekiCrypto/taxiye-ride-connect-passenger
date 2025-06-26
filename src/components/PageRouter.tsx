
import React from 'react';
import AuthPage from '@/components/AuthPage';
import EditProfilePage from '@/components/EditProfilePage';
import ChangePasswordPage from '@/components/ChangePasswordPage';
import ChangePhonePage from '@/components/ChangePhonePage';
import SavedAddressesPage from '@/components/SavedAddressesPage';
import NotificationsPage from '@/components/NotificationsPage';
import ReferralPage from '@/components/ReferralPage';
import HelpSupportPage from '@/components/HelpSupportPage';
import TripHistoryPage from '@/components/TripHistoryPage';
import PaymentSelector from '@/components/payment/PaymentSelector';
import HomeView from '@/components/home/HomeView';
import WalletContent from '@/components/wallet/WalletContent';
import TripsContent from '@/components/trips/TripsContent';
import ProfileContent from '@/components/profile/ProfileContent';
import { Session } from '@supabase/supabase-js';

interface PageRouterProps {
  currentPage: string;
  session: Session | null;
  userProfile: any;
  pickup: string;
  dropoff: string;
  activeInput: 'pickup' | 'dropoff';
  selectedVehicle: string;
  isRideInProgress: boolean;
  rideProgress: number;
  rideData: any;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onActiveInputChange: (input: 'pickup' | 'dropoff') => void;
  onVehicleChange: (vehicle: string) => void;
  onRideStart: (rideInfo: any) => void;
  onPageChange: (page: string) => void;
  onProfileAction: (action: string) => void;
}

const PageRouter = ({
  currentPage,
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
  onPageChange,
  onProfileAction
}: PageRouterProps) => {
  switch (currentPage) {
    case 'auth':
      return <AuthPage onBack={() => onPageChange('home')} />;
    case 'edit-profile':
      return <EditProfilePage onBack={() => onPageChange('profile')} />;
    case 'change-password':
      return <ChangePasswordPage onBack={() => onPageChange('profile')} />;
    case 'change-phone':
      return <ChangePhonePage onBack={() => onPageChange('profile')} />;
    case 'saved-addresses':
      return <SavedAddressesPage onBack={() => onPageChange('profile')} />;
    case 'notifications':
      return <NotificationsPage onBack={() => onPageChange('profile')} />;
    case 'referral':
      return <ReferralPage onBack={() => onPageChange('profile')} />;
    case 'help-support':
      return <HelpSupportPage onBack={() => onPageChange('profile')} />;
    case 'trip-history':
      return <TripHistoryPage onBack={() => onPageChange('trips')} />;
    case 'payment':
      return (
        <PaymentSelector
          onBack={() => onPageChange('home')}
          amount={120}
          rideDetails={{
            pickup: pickup,
            dropoff: dropoff,
            vehicleType: selectedVehicle
          }}
        />
      );
    case 'wallet':
      return <WalletContent />;
    case 'trips':
      return <TripsContent onViewTripHistory={() => onPageChange('trip-history')} />;
    case 'profile':
      return (
        <ProfileContent 
          session={session}
          userProfile={userProfile}
          onProfileAction={onProfileAction}
        />
      );
    case 'home':
    default:
      return (
        <HomeView
          session={session}
          userProfile={userProfile}
          pickup={pickup}
          dropoff={dropoff}
          activeInput={activeInput}
          selectedVehicle={selectedVehicle}
          isRideInProgress={isRideInProgress}
          rideProgress={rideProgress}
          rideData={rideData}
          onPickupChange={onPickupChange}
          onDropoffChange={onDropoffChange}
          onActiveInputChange={onActiveInputChange}
          onVehicleChange={onVehicleChange}
          onRideStart={onRideStart}
          onPaymentClick={() => onPageChange('payment')}
        />
      );
  }
};

export default PageRouter;
