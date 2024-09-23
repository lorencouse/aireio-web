'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { City } from '@/utils/types';

export const fetchCity = async (city: City) => {
  const supabase = createClient();
  const { name, country_code, state } = city;

  try {
    const { data: newCity, error: insertError } = await supabase
      .from('cities')
      .insert(city)
      .select('id')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        // City already exists, redirect
        redirect(`/cities/${country_code}/${state}/${name}`);
      } else {
        // Handle other types of errors
        console.error('Error inserting city:', insertError);
        throw new Error('Failed to insert city');
      }
    } else if (newCity) {
      // Upload city photo then redirect
      await uploadCityPhoto(city, newCity.id);
    } else {
      throw new Error('Failed to insert city: No data returned');
    }
  } catch (error) {
    console.error('Unexpected error in fetchCity:', error);
    throw error;
  }
};

const uploadCityPhoto = async (city: City, cityId: string) => {
  const supabase = createClient();

  if (city.photos && city.photos.length > 0) {
    const googlePhotoUrl = city.photos[0];
    const imgName = `${city.country_code}_${city.state}_${city.name}.jpg`;

    try {
      const success = await uploadImageToSupabase(
        googlePhotoUrl,
        imgName,
        'cities'
      );

      if (success) {
        const { error: updateError } = await supabase
          .from('cities')
          .update({ photo_ref: imgName })
          .eq('id', cityId);

        if (updateError) throw updateError;

        console.log('Photo updated in Supabase');
      }
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      // Log the error but continue with the redirect
    }
  }

  redirect(`/cities/${city.country_code}/${city.state}/${city.name}`);
};

export default fetchCity;
