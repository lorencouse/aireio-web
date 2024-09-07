'use server';
import { createClient } from '@/utils/supabase/server';

const uploadImageToSupabase = async (
  imageUrl: string,
  imgName: string,
  dir: string
): Promise<boolean> => {
  const supabase = createClient();
  const filePath = `${dir}/${imgName}`;

  try {
    // First, check if the image already exists
    const { data: existingFile, error: existingError } = await supabase.storage
      .from('images')
      .list(dir, {
        limit: 1,
        search: imgName
      });

    if (existingError) {
      console.error('Error checking existing file:', existingError);
      return false;
    }

    if (existingFile && existingFile.length > 0) {
      console.log('Image already exists:', filePath);
      return true;
    }

    // If the image doesn't exist, proceed with upload
    const response = await fetch(imageUrl);
    if (
      !response.ok ||
      !response.headers.get('content-type')?.includes('image')
    ) {
      throw new Error(
        'Failed to fetch image from the URL or invalid content type'
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, arrayBuffer, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: false // Changed to false since we're already checking existence
      });

    if (error) {
      throw error;
    }

    console.log('Image uploaded successfully:', data.path);
    return true;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return false;
  }
};

export default uploadImageToSupabase;
