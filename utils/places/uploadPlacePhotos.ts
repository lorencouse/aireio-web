'use server';

import { createClient } from '@/utils/supabase/server';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { Place } from '../types';

export const uploadPlacePhotos = async (
  place: Partial<Place>
): Promise<Place> => {
  const supabase = createClient();
  const photoRefs = place.photo_refs || [];
  const existingPhotoNames = place.photo_names || [];

  if (photoRefs.length === 0) {
    console.log('No photos found for place', place.name);
    return place;
  }

  if (existingPhotoNames.length === photoRefs.length) {
    console.log('All photos already exist for place', place.name);
    return place;
  }

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const maxWidth = 500;
  let newPhotoNames: string[] = [];

  // Calculate the number of photos to upload
  const photosToUploadCount = Math.max(
    0,
    photoRefs.length - existingPhotoNames.length
  );

  if (photosToUploadCount > 0) {
    const uploadResults = await Promise.all(
      photoRefs
        .slice(existingPhotoNames.length)
        .map(async (photoRef, index) => {
          const imageName = `${place.name}_${place.city}_${place.state}_${place.country_code}_${existingPhotoNames.length + index + 1}.jpg`;
          const formattedImageName = imageName.replace(/[^a-zA-Z0-9_.-]/g, '_');
          const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${API_KEY}`;
          const dir = `places/${place.city_id}/${place.id}`;

          try {
            const uploadSuccess = await uploadImageToSupabase(
              googlePhotoUrl,
              formattedImageName,
              dir
            );

            return uploadSuccess ? formattedImageName : null;
          } catch (error) {
            if (error.statusCode === '409') {
              console.log('Image already exists:', formattedImageName);
            }
            return null;
          }
        })
    );

    newPhotoNames = uploadResults.filter(
      (name): name is string => name !== null
    );
  }

  if (newPhotoNames.length > 0 && place.id) {
    const allPhotoNames = [...existingPhotoNames, ...newPhotoNames];
    const updatedPlace = {
      ...place,
      photo_names: allPhotoNames
    };

    // Insert new Image names
    const { error } = await supabase
      .from('places')
      .update({ photo_names: allPhotoNames })
      .eq('id', place.id)
      .single();

    if (error) {
      console.error('Error updating photo names:', error);
      return place;
    } else {
      return updatedPlace;
    }
  }

  return place;
};
