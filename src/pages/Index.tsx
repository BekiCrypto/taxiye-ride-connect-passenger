
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SecureErrorBoundary } from '@/components/SecureErrorBoundary';
import BottomNavigation from '@/components/BottomNavigation';
import PageRouter from '@/components/PageRouter';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useRideManagement } from '@/hooks/useRideManagement';

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedVehicle, setSelectedVehicle] = useState('economy');
  const [currentPage, setCurrentPage] = useState('home');

  const { isRideInProgress, rideProgress, rideData, handleRideStart } = useRideManagement();
  const { handleProfileAction } = useProfileActions(setCurrentPage);

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

  const shouldShowBottomNavigation = () => {
    const pagesWithoutNav = [
      'auth', 'edit-profile', 'change-password', 'change-phone', 
      'saved-addresses', 'notifications', 'referral', 'help-support', 
      'trip-history', 'payment'
    ];
    return !pagesWithoutNav.includes(currentPage);
  };

  return (
    <SecureErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto relative">
          <PageRouter
            currentPage={currentPage}
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
            onPageChange={setCurrentPage}
            onProfileAction={handleProfileAction}
          />
          
          {shouldShowBottomNavigation() && (
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
