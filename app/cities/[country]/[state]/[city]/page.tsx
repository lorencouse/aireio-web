// /app/cities/[country]/[state]/[city]/page.tsx

import { createClient } from '@/utils/supabase/server';
import PlacesPageLayout from './places-page-layout';
import { getCity, getPlaces } from './actions';
import { City } from '@/utils/types';

export default async function Places({
  params
}: {
  params: {
    country: string;
    state: string;
    city: string;
    place_type?: string;
    radius?: string;
    lat?: string;
    lng?: string;
  };
}) {
  const city: City = await getCity(params);

  const places = await getPlaces(city, params);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem]">
      <PlacesPageLayout city={city} places={places} />
    </div>
  );
}
