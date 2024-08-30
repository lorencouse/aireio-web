import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { City, PlaceResult } from '@/utils/types';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';

const supabase = createClient();

export async function POST(request: Request) {
  try {
    const city: PlaceResult = await request.json();
    console.log('Received city data:', city);

    const newCity = await createNewCity(city);
    console.log('New city created:', newCity);

    return NextResponse.json({ cityId: newCity.id }, { status: 201 });
  } catch (error) {
    console.error('Detailed error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

async function createNewCity(city: PlaceResult): Promise<City> {
  try {
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
      lat: city.geometry?.location?.lat || 0,
      lng: city.geometry?.location?.lng || 0,
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

    console.log('City details before insertion:', cityDetails);

    const { data: newCity, error: insertError } = await supabase
      .from('cities')
      .insert(cityDetails)
      .select('*')
      .single();

    if (insertError) {
      console.error('Error inserting city:', insertError);
      throw insertError;
    }

    console.log('New city after insertion:', newCity);

    if (city.photos && city.photos.length > 0) {
      const googlePhotoUrl = city.photos[0].getUrl({ maxWidth: 800 });
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
            .eq('id', newCity.id);

          if (updateError) throw updateError;
        }
      } catch (error) {
        console.error('Error uploading image to Supabase:', error);
      }
    }

    return newCity;
  } catch (error) {
    console.error('Error in createNewCity:', error);
    throw error;
  }
}
