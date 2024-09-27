'use server';

import { createClient } from '@/utils/supabase/server';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';

export const uploadPlacePhotos = async (place: Place): Promise<string[]> => {
  const supabase = createClient();
  const photoRefs = place.photo_refs;
  if (!photoRefs || photoRefs.length === 0) {
    console.log('No photos found for place', place.name);
    return place.photo_names;
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
          // console.log(
          //   `Place photo uploaded to Supabase: ${formattedImageName}`
          // );
          return formattedImageName;
        } else {
          // console.error(`Failed to upload photo: ${formattedImageName}`);
          return null;
        }
      } catch (error) {
        // console.error('Error uploading photo:', error);
        return null;
      }
    })
  );

  newPhotoNames = uploadResults.filter((name): name is string => name !== null);

  if (newPhotoNames.length > 0) {
    const allPhotoNames = [...place.photo_names, ...newPhotoNames];

    // Insert new Image names
    const { error } = await supabase
      .from('places')
      .update({ photo_names: allPhotoNames })
      .eq('id', place.id)
      .single();

    if (error) {
      // console.error('Error updating photo_names in database:', error);

      return place.photo_names;
    } else {
      // console.log(`Updated photo_names for place: ${place.name}`);
      return allPhotoNames;
    }
  }

  // console.log(`Finished uploading photos for place: ${place.name}`);
  return place.photo_names;
};
