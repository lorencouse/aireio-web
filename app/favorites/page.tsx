'use server';

import { Suspense } from 'react';
import FavoritesLayout from './favorites-layout';
import { getCitiesById } from '@/app/actions/fetch';
import LoadingGrid from '@/components/general/loading-grid';
import {
  getFavoritePlaces,
  getPlacesById
} from '@/app/cities/[country]/[state]/[city]/[id]/actions';
import { Place } from '@/utils/types';

export default async function Favorites() {
  const favorites: {
    places: { place_id: string }[];
    count: number;
    error?: string;
    authError?: boolean;
  } = await getFavoritePlaces(1, 10);

  const places: Place[] = await getPlacesById(
    favorites.places.map((p) => p.place_id)
  );

  // Use Array.from with type assertion for countries
  const countries = Array.from(new Set(places.map((p) => p.country))).reduce<
    Array<{ country: string; country_code: string }>
  >((acc, country) => {
    const place = places.find((p) => p.country === country);
    if (place?.country && place?.country_code) {
      acc.push({
        country: place.country,
        country_code: place.country_code
      });
    }
    return acc;
  }, []);

  // Use Array.from with type assertion for city IDs
  const cityIds = Array.from(new Set(places.map((p) => p.city_id))).filter(
    (id): id is string => id !== null
  );

  const cities = await getCitiesById(cityIds);

  return (
    <Suspense fallback={<LoadingGrid />}>
      <FavoritesLayout places={places} cities={cities} countries={countries} />
    </Suspense>
  );
}
