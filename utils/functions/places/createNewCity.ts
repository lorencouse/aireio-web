import { supabase } from '@/lib/supabase';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { City } from '@/utils/types';
import useSupabase from '@/utils/hook/useSupabase';

const createNewCity = async (city: City) => {
  try {
    const supabase = useSupabase();
    const fullName = city.address_components
      ? city.address_components
          .map((component) => component.long_name)
          .join(', ')
      : '';
    const cityName = city.address_components
      ? city.address_components[0].long_name
      : '';
    const countryCode = city.address_components
      ? city.address_components[city.address_components.length - 1]
          ?.short_name || ''
      : '';
    const imgName = `${countryCode}_${cityName}_${city.place_id}.jpg`;

    const cityDetails: Omit<City, 'id'> = {
      google_id: city.place_id || '',
      osm_id: '',
      name: cityName,
      full_name: fullName,
      lat: city.geometry?.location?.lat() || 0,
      lng: city.geometry?.location?.lng() || 0,
      state: city.address_components
        ? city.address_components[city.address_components.length - 2]
            ?.long_name || ''
        : '',
      state_code: city.address_components
        ? city.address_components[city.address_components.length - 2]
            ?.short_name || ''
        : '',
      country: city.address_components
        ? city.address_components[city.address_components.length - 1]
            ?.long_name || ''
        : '',
      country_code: countryCode,
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
      return { error: insertError };
    }

    const cityId = newCity.id;

    if (city.photos && city.photos.length > 0) {
      const googlePhotoUrl = city.photos[0].getUrl({ maxWidth: 800 });
      try {
        const success = await uploadImageToSupabase(googlePhotoUrl, imgName);

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

    return { cityId };
  } catch (error) {
    console.error('Unexpected error in createNewCity:', error);
    return { error };
  }
};

export default createNewCity;
