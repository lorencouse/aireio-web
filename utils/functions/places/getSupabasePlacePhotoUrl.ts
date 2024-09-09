import { createClient } from '@supabase/supabase-js';
import { placeholderImage } from '@/utils/constants';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const getSupabasePlacePhotoUrls = async (
  cityId: string,
  placeId: string
): Promise<string[]> => {
  if (!placeId || !cityId) {
    return [placeholderImage];
  }

  try {
    const { data, error } = await supabase.storage
      .from('images')
      .list(`places/${cityId}/${placeId}`);

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Get public URLs for all files in the directory
      const photoUrls = await Promise.all(
        data.map(async (file) => {
          const { data: fileData } = supabase.storage
            .from('images')
            .getPublicUrl(`places/${cityId}/${placeId}/${file.name}`);

          if (fileData) {
            const url = new URL(fileData.publicUrl);
            // Add cache-control header to the URL
            url.searchParams.append(
              'cache-control',
              'public, max-age=31536000, immutable'
            );
            return url.toString();
          }
          return [placeholderImage];
        })
      );

      // Filter out any null values and return the array of URLs
      const filteredPhotoUrls = photoUrls.filter(
        (url): url is string => url !== null
      );

      console.log('Photo URLs:', filteredPhotoUrls);
      return filteredPhotoUrls;
    }

    // If no files found, return array with default image
    return [placeholderImage];
  } catch (error) {
    console.error('Error fetching Supabase photo URLs:', error);
    return [placeholderImage];
  }
};

export default getSupabasePlacePhotoUrls;
