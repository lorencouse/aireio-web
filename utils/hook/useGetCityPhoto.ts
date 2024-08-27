import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

export const useGetCityPhoto = (city: City) => {
  const supabase = createClientComponentClient<Database>();
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const photoRef = city.photo_ref
    ? city.photo_ref
    : `${city.country_code}_${city.name}_${city.google_id}.jpg`;

  React.useEffect(() => {
    const fetchImageUrl = async () => {
      if (photoRef) {
        try {
          const { data, error } = supabase.storage
            .from('images')
            .getPublicUrl(`cities/${photoRef}`);

          if (error || !data) {
            throw new Error('Failed to retrieve public URL');
          }

          setImageUrl(data.publicUrl);
        } catch (error) {
          console.error('Error fetching image URL:', error);
          setImageUrl(null);
        }
      }
    };
    fetchImageUrl();
  }, [city.photo_ref, supabase, photoRef]);

  return {
    imageUrl
  };
};

export default useGetCityPhoto;
