'use server';

import { createClient } from '@/utils/supabase/server';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { Place } from '../types';

export const uploadPlacePhotos = async (
  place: Partial<Place>
): Promise<string[]> => {
  const supabase = createClient();
  const photoRefs = place.photo_refs;
  if (!photoRefs || photoRefs.length === 0) {
    console.log('No photos found for place', place.name);
    return place.photo_names || [];
  }

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const maxWidth = 600;
  let newPhotoNames: string[] = [];

  const uploadResults = await Promise.all(
    photoRefs.map(async (photoRef, index) => {
      const imageName =
        photoRefs.length === 1
          ? `${place.name}_${place.city}_${place.state}_${place.country_code}_0.jpg`
          : `${place.name}_${place.city}_${place.state}_${place.country_code}_${index + 1}.jpg`;

      const formattedImageName = imageName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${API_KEY}`;
      const dir = `places/${place.city_id}/${place.id}`;

      try {
        const uploadSuccess = await uploadImageToSupabase(
          googlePhotoUrl,
          formattedImageName,
          dir
        );

        if (uploadSuccess) {
          return formattedImageName;
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    })
  );

  newPhotoNames = uploadResults.filter((name): name is string => name !== null);

  if (newPhotoNames.length > 0 && place.id) {
    const existingPhotoNames = Array.isArray(place.photo_names)
      ? place.photo_names
      : [];
    const allPhotoNames = [...existingPhotoNames, ...newPhotoNames];

    // Insert new Image names
    const { error } = await supabase
      .from('places')
      .update({ photo_names: allPhotoNames })
      .eq('id', place.id)
      .single();

    if (error) {
      return existingPhotoNames;
    } else {
      return allPhotoNames;
    }
  }

  return Array.isArray(place.photo_names) ? place.photo_names : [];
};
