'use server';

import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { Autocomplete } from '@react-google-maps/api';

import useSupabase from '@/utils/hook/useSupabase';

const createNewCity = async (cityData: any) => {
  try {
    const supabase = useSupabase();

    const cityDetails: Omit<City, 'id'> = {
      google_id: cityData.google_id || '',
      osm_id: '',
      name: cityData.name,
      full_name: cityData.full_name,
      lat: cityData.lat || 0,
      lng: cityData.lng || 0,
      state: cityData.state || '',
      state_code: cityData.state_code || '',
      country: cityData.country || '',
      country_code: cityData.country_code || '',
      cafe_ids: [],
      library_ids: [],
      coworking_ids: [],
      google_place_ids: [],
      blacklist_google_ids: [],
      photo_ref: ''
    };

    const { data: newCity, error: insertError } = await supabase
      .from('cities')
      .insert(cityDetails)
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting city:', insertError);
      return { error: insertError.message };
    }

    const cityId = newCity.id;

    if (cityData.photos && cityData.photos.length > 0) {
      const googlePhotoUrl = cityData.photos[0];
      const imgName = `${cityData.country_code}_${cityData.state}_${cityData.name}.jpg`;

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
      }
    }

    return { id: cityId, ...cityDetails };
  } catch (error) {
    console.error('Unexpected error in createNewCity:', error);
    return { error: error.message };
  }
};

export default createNewCity;
