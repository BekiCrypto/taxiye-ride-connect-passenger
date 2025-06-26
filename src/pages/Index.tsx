import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SecureErrorBoundary } from '@/components/SecureErrorBoundary';
import AuthPage from '@/components/AuthPage';
import HomeHeader from '@/components/home/HomeHeader';
import HomeContent from '@/components/home/HomeContent';
import WalletContent from '@/components/wallet/WalletContent';
import TripsContent from '@/components/TripsContent';
import ProfileContent from '@/components/profile/ProfileContent';
import BottomNavigation from '@/components/BottomNavigation';
import PaymentSelector from '@/components/payment/PaymentSelector';
import EditProfilePage from '@/components/EditProfilePage';
import SavedAddressesPage from '@/components/SavedAddressesPage';
import NotificationsPage from '@/components/NotificationsPage';
import ReferralPage from '@/components/ReferralPage';
import HelpSupportPage from '@/components/HelpSupportPage';
import TripHistoryPage from '@/components/TripHistoryPage';
import ChangePasswordPage from '@/components/ChangePasswordPage';
import ChangePhonePage from '@/components/ChangePhonePage';

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedVehicle, setSelectedVehicle] = useState('economy');
  const [isRideInProgress, setIsRideInProgress] = useState(false);
  const [rideProgress, setRideProgress] = useState(0);
  const [rideData, setRideData] = useState<any>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile(session.user.id);
    } else {
      setUserProfile(null);
    }
  }, [session]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('passengers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handleRideStart = (rideInfo: any) => {
    setIsRideInProgress(true);
    setRideData(rideInfo);
    setRideProgress(20);

    // Simulate ride progress
    const interval = setInterval(() => {
      setRideProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 20, 100);
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRideInProgress(false);
            setRideProgress(0);
            setRideData(null);
          }, 3000);
        }
        return newProgress;
      });
    }, 2000);
  };

  const handleProfileAction = (action: string) => {
    console.log('Profile action:', action);
    
    switch (action) {
      case 'edit-profile':
        setCurrentPage('edit-profile');
        break;
      case 'change-password':
        setCurrentPage('change-password');
        break;
      case 'change-phone':
        setCurrentPage('change-phone');
        break;
      case 'saved-addresses':
        setCurrentPage('saved-addresses');
        break;
      case 'notifications':
        setCurrentPage('notifications');
        break;
      case 'referral':
        setCurrentPage('referral');
        break;
      case 'help-support':
        setCurrentPage('help-support');
        break;
      case 'auth':
        setCurrentPage('auth');
        break;
      case 'logout':
        handleSignOut();
        break;
      default:
        console.log('Unknown profile action:', action);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage onBack={() => setCurrentPage('home')} />;
      case 'edit-profile':
        return <EditProfilePage onBack={() => setCurrentPage('profile')} />;
      case 'change-password':
        return <ChangePasswordPage onBack={() => setCurrentPage('profile')} />;
      case 'change-phone':
        return <ChangePhonePage onBack={() => setCurrentPage('profile')} />;
      case 'saved-addresses':
        return <SavedAddressesPage onBack={() => setCurrentPage('profile')} />;
      case 'notifications':
        return <NotificationsPage onBack={() => setCurrentPage('profile')} />;
      case 'referral':
        return <ReferralPage onBack={() => setCurrentPage('profile')} />;
      case 'help-support':
        return <HelpSupportPage onBack={() => setCurrentPage('profile')} />;
      case 'trip-history':
        return <TripHistoryPage onBack={() => setCurrentPage('trips')} />;
      case 'payment':
        return (
          <PaymentSelector
            onBack={() => setCurrentPage('home')}
            amount={120}
            rideDetails={{
              pickup: pickup,
              dropoff: dropoff,
              vehicleType: selectedVehicle
            }}
          />
        );
      case 'home':
        return (
          <div className="space-y-4">
            <HomeHeader 
              session={session}
              userProfile={userProfile}
              isRideInProgress={isRideInProgress}
              rideData={rideData}
            />
            <HomeContent
              session={session}
              userProfile={userProfile}
              pickup={pickup}
              dropoff={dropoff}
              activeInput={activeInput}
              selectedVehicle={selectedVehicle}
              isRideInProgress={isRideInProgress}
              rideProgress={rideProgress}
              rideData={rideData}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
              onActiveInputChange={setActiveInput}
              onVehicleChange={setSelectedVehicle}
              onRideStart={handleRideStart}
              onPaymentClick={() => setCurrentPage('payment')}
            />
          </div>
        );
      case 'wallet':
        return <WalletContent />;
      case 'trips':
        return <TripsContent onTripHistoryClick={() => setCurrentPage('trip-history')} />;
      case 'profile':
        return (
          <ProfileContent 
            session={session}
            userProfile={userProfile}
            onProfileAction={handleProfileAction}
          />
        );
      default:
        return (
          <div className="space-y-4">
            <HomeHeader 
              session={session}
              userProfile={userProfile}
              isRideInProgress={isRideInProgress}
              rideData={rideData}
            />
            <HomeContent
              session={session}
              userProfile={userProfile}
              pickup={pickup}
              dropoff={dropoff}
              activeInput={activeInput}
              selectedVehicle={selectedVehicle}
              isRideInProgress={isRideInProgress}
              rideProgress={rideProgress}
              rideData={rideData}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
              onActiveInputChange={setActiveInput}
              onVehicleChange={setSelectedVehicle}
              onRideStart={handleRideStart}
              onPaymentClick={() => setCurrentPage('payment')}
            />
          </div>
        );
    }
  };

  return (
    <SecureErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto relative">
          {renderCurrentPage()}
          
          {!['auth', 'edit-profile', 'change-password', 'change-phone', 'saved-addresses', 'notifications', 'referral', 'help-support', 'trip-history', 'payment'].includes(currentPage) && (
            <BottomNavigation 
              activeTab={currentPage} 
              onTabChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </SecureErrorBoundary>
  );
};

export default Index;
