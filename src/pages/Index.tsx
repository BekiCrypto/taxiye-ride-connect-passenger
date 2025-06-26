import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Wallet, History, User, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import BottomNavigation from '@/components/BottomNavigation';
import RideRequestCard from '@/components/RideRequestCard';
import LocationSelector from '@/components/LocationSelector';
import AuthPage from '@/components/AuthPage';
import EditProfilePage from '@/components/EditProfilePage';
import SavedAddressesPage from '@/components/SavedAddressesPage';
import NotificationsPage from '@/components/NotificationsPage';
import HelpSupportPage from '@/components/HelpSupportPage';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
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
                    Hello, {session ? userProfile?.name || 'User' : 'Guest'}!
                  </h1>
                  <p className="text-gray-400 text-sm">Where to today?</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Bell className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Home</p>
                  <p className="text-gray-400 text-xs">Bole, Addis Ababa</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Work</p>
                  <p className="text-gray-400 text-xs">CMC, Addis Ababa</p>
                </CardContent>
              </Card>
            </div>

            {/* Location Selection */}
            <LocationSelector
              pickup={pickup}
              dropoff={dropoff}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
            />

            {/* Ride Request Card */}
            <RideRequestCard pickup={pickup} dropoff={dropoff} />
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

            {/* Top-up Options */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Top-up Options</h3>
              
              <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                <Phone className="w-5 h-5 mr-3" />
                Telebirr
              </Button>
              
              <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                <Wallet className="w-5 h-5 mr-3" />
                Bank Transfer
              </Button>
              
              <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                <Wallet className="w-5 h-5 mr-3" />
                Card Payment
              </Button>
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
            <h2 className="text-2xl font-bold text-white mb-6">Trip History</h2>
            
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-white font-medium">Bole to CMC</p>
                      <p className="text-gray-400 text-sm">Today, 2:30 PM</p>
                    </div>
                    <p className="text-yellow-500 font-bold">ETB 85.00</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">• Excellent service</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-white font-medium">Home to Merkato</p>
                      <p className="text-gray-400 text-sm">Yesterday, 10:15 AM</p>
                    </div>
                    <p className="text-yellow-500 font-bold">ETB 120.00</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <span key={star} className="text-yellow-500">★</span>
                      ))}
                      <span className="text-gray-400">★</span>
                    </div>
                    <span className="text-gray-400 text-sm">• Good ride</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-white font-medium">Airport to Hotel</p>
                      <p className="text-gray-400 text-sm">2 days ago, 8:45 PM</p>
                    </div>
                    <p className="text-yellow-500 font-bold">ETB 200.00</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">• Perfect!</span>
                  </div>
                </CardContent>
              </Card>
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
