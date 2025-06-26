
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { SecureErrorBoundary } from '@/components/SecureErrorBoundary';

// Component imports
import BottomNavigation from '@/components/BottomNavigation';
import AuthPage from '@/components/AuthPage';
import EditProfilePage from '@/components/EditProfilePage';
import SavedAddressesPage from '@/components/SavedAddressesPage';
import NotificationsPage from '@/components/NotificationsPage';
import HelpSupportPage from '@/components/HelpSupportPage';
import TripHistoryPage from '@/components/TripHistoryPage';
import PaymentSelector from '@/components/payment/PaymentSelector';
import ReferralPage from '@/components/ReferralPage';

// Content components
import HomeContent from '@/components/home/HomeContent';
import WalletContent from '@/components/wallet/WalletContent';
import TripsContent from '@/components/trips/TripsContent';
import ProfileContent from '@/components/profile/ProfileContent';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedVehicle, setSelectedVehicle] = useState('mini');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Ride state
  const [isRideInProgress, setIsRideInProgress] = useState(false);
  const [rideProgress, setRideProgress] = useState(0);
  const [rideData, setRideData] = useState<{
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  } | null>(null);
  
  const { toast } = useToast();
  const { user, session, loading, signOut } = useSecureAuth();
  
  // Initialize Google Maps
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  // Set up user profile from session
  const userProfile = session?.user ? {
    name: session.user.user_metadata?.name || 'User',
    email: session.user.email,
    phone: session.user.phone
  } : null;

  useEffect(() => {
    if (!loading) {
      if (!session && isInitialLoad) {
        setCurrentPage('auth');
      } else if (session && currentPage === 'auth') {
        setCurrentPage(null);
      }
      setIsInitialLoad(false);
    }
  }, [session, loading, isInitialLoad, currentPage]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      setCurrentPage('auth');
      setActiveTab('home');
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileAction = (action: string) => {
    if (!session && action !== 'auth') {
      setCurrentPage('auth');
      return;
    }

    switch (action) {
      case 'auth':
        setCurrentPage('auth');
        break;
      case 'edit-profile':
        setCurrentPage('edit-profile');
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
      case 'logout':
        handleSignOut();
        break;
      default:
        break;
    }
  };

  const handleRideStart = (rideInfo: {
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  }) => {
    setIsRideInProgress(true);
    setRideData(rideInfo);
    setRideProgress(0);
    
    // Simulate ride progress
    const progressInterval = setInterval(() => {
      setRideProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsRideInProgress(false);
          setRideData(null);
          toast({
            title: "Ride Completed!",
            description: "Thank you for riding with Taxiye. Rate your trip!",
          });
          return 0;
        }
        return prev + 2;
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show specific pages
  if (currentPage === 'auth') {
    return <AuthPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'edit-profile') {
    return <EditProfilePage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'saved-addresses') {
    return <SavedAddressesPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'notifications') {
    return <NotificationsPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'referral') {
    return <ReferralPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'help-support') {
    return <HelpSupportPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'trip-history') {
    return <TripHistoryPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'payment') {
    return (
      <PaymentSelector 
        onBack={() => setCurrentPage(null)} 
        amount={120}
        rideDetails={{
          pickup: pickup || "Current Location",
          dropoff: dropoff || "Destination",
          vehicleType: selectedVehicle
        }}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
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
        );
      case 'wallet':
        return <WalletContent />;
      case 'trips':
        return <TripsContent onViewTripHistory={() => setCurrentPage('trip-history')} />;
      case 'profile':
        return (
          <ProfileContent
            session={session}
            userProfile={userProfile}
            onProfileAction={handleProfileAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SecureErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
          <div className="p-4 pb-20">
            {renderContent()}
          </div>
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </SecureErrorBoundary>
  );
};

export default Index;
