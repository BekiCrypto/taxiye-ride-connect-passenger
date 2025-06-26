import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Wallet, History, User, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import BottomNavigation from '@/components/BottomNavigation';
import LocationSelector from '@/components/LocationSelector';
import MapView from '@/components/MapView';
import VehicleSelector from '@/components/VehicleSelector';
import AuthPage from '@/components/AuthPage';
import EditProfilePage from '@/components/EditProfilePage';
import SavedAddressesPage from '@/components/SavedAddressesPage';
import NotificationsPage from '@/components/NotificationsPage';
import HelpSupportPage from '@/components/HelpSupportPage';
import TripHistoryPage from '@/components/TripHistoryPage';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import PaymentSelector from '@/components/payment/PaymentSelector';
import TelebirrTopUp from '@/components/wallet/TelebirrTopUp';
import BankTransferTopUp from '@/components/wallet/BankTransferTopUp';
import CardPaymentTopUp from '@/components/wallet/CardPaymentTopUp';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedVehicle, setSelectedVehicle] = useState('mini');
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Ride state
  const [isRideInProgress, setIsRideInProgress] = useState(false);
  const [rideProgress, setRideProgress] = useState(0);
  const [rideData, setRideData] = useState<{
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  } | null>(null);
  
  const { toast } = useToast();
  
  // Initialize Google Maps
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        setUserProfile({
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email,
          phone: session.user.phone
        });
      } else {
        setUserProfile(null);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUserProfile({
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email,
          phone: session.user.phone
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      setCurrentPage(null);
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
    if (!session) {
      setCurrentPage('auth');
      return;
    }

    switch (action) {
      case 'edit-profile':
        setCurrentPage('edit-profile');
        break;
      case 'saved-addresses':
        setCurrentPage('saved-addresses');
        break;
      case 'notifications':
        setCurrentPage('notifications');
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
        return prev + 2; // Increase by 2% every interval
      });
    }, 1000); // Update every second
  };

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
        amount={120} // Example fare amount
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
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
                    alt="Taxiye" 
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {isRideInProgress ? 'Ride in Progress' : `Hello, ${session ? userProfile?.name || 'User' : 'Guest'}!`}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {isRideInProgress ? 'Enjoy your ride' : 'Where to today?'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Bell className="w-5 h-5" />
              </Button>
            </div>

            {/* Google Maps View */}
            <MapView
              pickup={pickup}
              dropoff={dropoff}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
              activeInput={activeInput}
              onActiveInputChange={setActiveInput}
              isRideInProgress={isRideInProgress}
              rideProgress={rideProgress}
              estimatedTime={rideData?.estimatedTime}
              driverName={rideData?.driverName}
              vehicleType={rideData?.vehicleType}
            />

            {/* Location Selection - Only show when ride is not in progress */}
            {!isRideInProgress && (
              <LocationSelector
                pickup={pickup}
                dropoff={dropoff}
                onPickupChange={setPickup}
                onDropoffChange={setDropoff}
                activeInput={activeInput}
                onActiveInputChange={setActiveInput}
              />
            )}

            {/* Vehicle Selection - Only show when ride is not in progress */}
            {!isRideInProgress && (
              <VehicleSelector
                selectedVehicle={selectedVehicle}
                onVehicleChange={setSelectedVehicle}
                pickup={pickup}
                dropoff={dropoff}
                onRideStart={handleRideStart}
              />
            )}

            {/* Payment Button - Show after ride completion simulation */}
            {pickup && dropoff && !isRideInProgress && (
              <Button
                onClick={() => setCurrentPage('payment')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3"
              >
                Test Payment Options
              </Button>
            )}
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Wallet</h2>
            
            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-0">
              <CardContent className="p-6 text-center">
                <p className="text-black/70 text-sm mb-2">Current Balance</p>
                <p className="text-3xl font-bold text-black">ETB 450.00</p>
              </CardContent>
            </Card>

            {/* Top-up Options with Accordion */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Top-up Options</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="telebirr" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
                    Telebirr Top-up
                  </AccordionTrigger>
                  <AccordionContent>
                    <TelebirrTopUp />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="bank-transfer" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
                    Bank Transfer
                  </AccordionTrigger>
                  <AccordionContent>
                    <BankTransferTopUp />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="card-payment" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
                    Card Payment
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardPaymentTopUp />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Ride Payment</p>
                      <p className="text-gray-400 text-sm">Today, 2:30 PM</p>
                    </div>
                    <p className="text-red-400 font-medium">-ETB 85.00</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Telebirr Top-up</p>
                      <p className="text-gray-400 text-sm">Yesterday, 5:15 PM</p>
                    </div>
                    <p className="text-green-400 font-medium">+ETB 200.00</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'trips':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Trips</h2>
              <Button
                onClick={() => setCurrentPage('trip-history')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                View All History
              </Button>
            </div>
            
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your Trips</h3>
              <p className="text-gray-400 mb-6">
                View your complete trip history with detailed information about each ride.
              </p>
              <Button
                onClick={() => setCurrentPage('trip-history')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3"
              >
                View Trip History
              </Button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
            
            {/* Profile Header */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-black" />
                </div>
                {session ? (
                  <>
                    <h3 className="text-xl font-bold text-white">{userProfile?.name || 'User'}</h3>
                    <p className="text-gray-400">{userProfile?.phone || userProfile?.email}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white">Welcome</h3>
                    <p className="text-gray-400">Sign in to access your profile</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Profile Options */}
            <div className="space-y-3">
              {session ? (
                <>
                  <Button 
                    onClick={() => handleProfileAction('edit-profile')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Edit Profile
                  </Button>
                  
                  <Button 
                    onClick={() => handleProfileAction('saved-addresses')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                  >
                    <MapPin className="w-5 h-5 mr-3" />
                    Saved Addresses
                  </Button>
                  
                  <Button 
                    onClick={() => handleProfileAction('notifications')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                  >
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                  </Button>
                  
                  <Button 
                    onClick={() => handleProfileAction('help-support')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    Help & Support
                  </Button>
                  
                  <Button 
                    onClick={() => handleProfileAction('logout')}
                    className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setCurrentPage('auth')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
        <div className="p-4 pb-20">
          {renderContent()}
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
