'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { City } from '@/utils/types';

export const fetchCity = async (city: City) => {
  const supabase = createClient();
  const { name, country_code, state } = city;

  try {
    // URL encode the city name
    const encodedName = encodeURIComponent(name);

    const { data: existingCity, error: fetchError } = await supabase
      .from('cities')
      .select('id')
      .eq('name', name)
      .eq('country_code', country_code)
      .eq('state', state)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        // City doesn't exist, insert it
        const { data: newCity, error: insertError } = await supabase
          .from('cities')
          .insert(city)
          .select('id')
          .single();

        if (insertError) {
          console.error('Error inserting city:', insertError);
          throw new Error('Failed to insert city');
        } else if (newCity) {
          await uploadCityPhoto(city, newCity.id);
        }
      } else {
        console.error('Error fetching city:', fetchError);
        throw new Error('Failed to fetch city');
      }
    } else if (existingCity) {
      // City already exists, redirect
      redirect(`/cities/${country_code}/${state}/${encodedName}`);
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
