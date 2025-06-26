
import { supabase } from '@/integrations/supabase/client';

export const useProfileActions = (onPageChange: (page: string) => void) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onPageChange('home');
  };

  const handleProfileAction = (action: string) => {
    console.log('Profile action:', action);
    
    switch (action) {
      case 'edit-profile':
        onPageChange('edit-profile');
        break;
      case 'change-password':
        onPageChange('change-password');
        break;
      case 'change-phone':
        onPageChange('change-phone');
        break;
      case 'saved-addresses':
        onPageChange('saved-addresses');
        break;
      case 'notifications':
        onPageChange('notifications');
        break;
      case 'referral':
        onPageChange('referral');
        break;
      case 'help-support':
        onPageChange('help-support');
        break;
      case 'auth':
        onPageChange('auth');
        break;
      case 'logout':
        handleSignOut();
        break;
      default:
        console.log('Unknown profile action:', action);
    }
  };

  return { handleProfileAction };
};
