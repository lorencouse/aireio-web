'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { City } from '@/utils/types';

export const fetchCity = async (city: City) => {
  const supabase = createClient();
  const { name, country_code, state, google_id } = city;

  try {
    const { data: upsertedCity, error: upsertError } = await supabase
      .from('cities')
      .upsert(city, {
        onConflict: 'google_id',
        returning: 'minimal'
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting city:', upsertError);
      throw new Error('Failed to upsert city');
    }

    if (upsertedCity) {
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

      const completeCity = {
        ...city,
        id: upsertedCity.id,
        photo_ref: photoRef
      };
      await uploadCityPhoto(completeCity);
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
          .eq('id', city.id);

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
