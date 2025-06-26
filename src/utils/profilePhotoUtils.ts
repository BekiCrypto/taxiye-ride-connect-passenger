
import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadProfilePhoto = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please select an image file.' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Please select an image smaller than 5MB.' };
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Replace existing file
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload image. Please try again.' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image. Please try again.' };
  }
};

export const deleteProfilePhoto = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([`${userId}/profile.jpg`, `${userId}/profile.jpeg`, `${userId}/profile.png`]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
