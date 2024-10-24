// /app/cities/[country]/[state]/[city]/page.tsx
import CityPageLayout from './city-page-layout';
import { getCity, fetchExistingPlaces } from './actions';
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

  const places = await fetchExistingPlaces(city.id);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem]">
      <CityPageLayout city={city} places={places} />
    </div>
  );
}
