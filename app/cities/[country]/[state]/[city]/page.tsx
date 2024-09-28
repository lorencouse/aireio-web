import { createClient } from '@/utils/supabase/server';
import PlacesPageLayout from './places-page-layout';
import { getCity, getPlaces } from './actions';

export default async function Places({
  params
}: {
  params: { country: string; state: string; city: string };
}) {
  const city = await getCity(params.city);



  const places = await getPlaces(city);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">

      <PlacesPageLayout city={city} places={places} />
    </div>
  );
}
