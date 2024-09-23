// app/cities/[country]/[state]/[city]/page.tsx
import { createClient } from '@/utils/supabase/server';
import PlacesPageLayout from './places-page-layout';
import CityHero from './_components/city-hero';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';
import { cookies } from 'next/headers';

export default async function Places({
  params
}: {
  params: { country: string; state: string; city: string };
}) {
  const cityName = params.city;
  const countryName = params.country;
  const supabase = createClient();
  const imageName = `${params.country}_${params.state}_${cityName}.jpg`;

  try {
    const { data: city, error } = await supabase
      .from('cities')
      .select('*')
      .eq('name', cityName)
      .single();

    if (error) {
      throw error;
    }

    if (!city) {
      throw new Error('City not found');
    }

    // Get the public URL for the image

    const imageUrl = getSupabaseCityPhotoUrl(
      cityName,
      params.state,
      countryName
    );

    // Fetch places

    const { data: places, error: placesError } = await supabase
      .from('places')
      .select('*')
      .eq('city_id', city.id);

    if (placesError) {
      throw placesError;
    } else if (!places) {
      throw new Error('Places not found');
    }


    return (
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <CityHero
          cityName={cityName.replace(/-/g, ' ')}
          countryName={city.country}
          imageUrl={imageUrl}
        />
        <PlacesPageLayout city={city} places={places} />
      </div>
    );
  } catch (error) {
    console.log('Error fetching city:', error, 'cityName:', cityName);
    return <div>Error loading city</div>;
  }
}


