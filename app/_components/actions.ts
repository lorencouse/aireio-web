'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { City } from '@/utils/types';

export const fetchCity = async (city: Partial<City>) => {
  const supabase = createClient();
  const {
    name,
    country,
    country_code,
    state,
    state_code,
    google_id,
    lat,
    lng
  } = city;

  if (
    !name ||
    !country ||
    !country_code ||
    !state ||
    !state_code ||
    !google_id ||
    lat === undefined ||
    lng === undefined
  ) {
    throw new Error('Missing required fields for city');
  }

  try {
    const { data: insertedCity, error: insertError } = await supabase
      .from('cities')
      .insert({
        name,
        lat,
        lng,
        country,
        country_code,
        state,
        state_code,
        google_id
      })
      .select()
      .single();

    if (!insertError) {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${google_id}&fields=photos&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
      );
      if (!res.ok) {
        throw new Error(
          `Network response was not ok: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      console.log('Received data:', data);

      const photoRef = data.result?.photos?.[0]?.photo_reference || '';
      console.log('Photo reference:', photoRef);
      if (insertedCity) {
        const completeCity: City = {
          ...(insertedCity as City),
          photo_ref: photoRef
        };
        await uploadCityPhoto(completeCity);
      }
    }

    redirect(`/cities/${country_code}/${state}/${name}`);
  } catch (error) {
    console.error('Unexpected error in fetchCity:', error);
    throw error;
  }
};

const uploadCityPhoto = async (city: City) => {
  const supabase = createClient();
  const maxWidth = 1200;

  if (city.photo_ref) {
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${city.photo_ref}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;
    const imgName = `${city.country_code}_${city.state}_${city.name}.jpg`;
    const googleId = city.google_id || '';

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
          .eq('google_id', googleId);

        if (updateError) throw updateError;

        console.log('Photo updated in Supabase');
      }
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
    }
  }

  redirect(`/cities/${city.country_code}/${city.state}/${city.name}`);
};

export default fetchCity;
