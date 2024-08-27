import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { City, Place } from '@/utils/types';

import { Database } from '@/types/supabase';

async function addPlaceToBlacklist(place: Place) {
  const supabase = createClientComponentClient<Database>();
  const cityId = place.address.city_id;

  try {
    // Fetch the city that contains this place
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select()
      .eq('id', cityId)
      .single(); // Assumes there is only one matching city

    if (cityError || !cityData) {
      throw cityError || new Error('City not found');
    }

    const city = cityData as City;

    // Update the city with filtered IDs and add the google_place_id to the blacklist
    const updatedCity: Partial<City> = {
      blacklist_google_ids: [
        ...(city.blacklist_google_ids || []),
        place.google_place_id,
      ],
      [`${place.type}_ids`]:
        city[`${place.type}_ids`]?.filter((id) => id !== place.id) || [],
      google_place_ids:
        city.google_place_ids?.filter((id) => id !== place.google_place_id) ||
        [],
    };

    const { data: updatedCityData, error: updateCityError } = await supabase
      .from('cities')
      .update(updatedCity)
      .eq('id', cityId)
      .select();

    if (updateCityError) {
      throw updateCityError;
    }

    // Remove the place from the Places database
    const { error: deletePlaceError } = await supabase
      .from('places')
      .delete()
      .eq('id', place.id);

    if (deletePlaceError) {
      // Optionally, you could attempt to roll back the city update here
      throw deletePlaceError;
    }

    return {
      success: true,
      message: 'Place successfully blacklisted and removed.',
    };
  } catch (error) {
    console.error('Error in addPlaceToBlacklist:', error);
    throw error;
  }
}

export default addPlaceToBlacklist;
