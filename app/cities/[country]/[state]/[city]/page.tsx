// app/cities/[country]/[state]/[city]/page.tsx
import { createClient } from '@/utils/supabase/server';
import PlacesPageLayout from './places-page-layout';
import CityHero from './_components/city-hero';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';
// import { cookies } from 'next/headers';
import { getCity, getPlaces } from './actions';

export default async function Places({
  params
}: {
  params: { country: string; state: string; city: string };
}) {
  const city = await getCity(params.city);
  const cityName = params.city.replace(/-/g, ' ');

  const imageUrl = getSupabaseCityPhotoUrl(
    params.city,
    params.state,
    params.country
  );

  const places = await getPlaces(city);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
      <CityHero
        cityName={cityName}
        countryName={city.country}
        imageUrl={imageUrl}
      />
      <PlacesPageLayout city={city} places={places} />
    </div>
  );
}
