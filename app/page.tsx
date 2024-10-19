'use server';

import { Suspense } from 'react';

import HomeLayout from './home-layout';

import { getAllCities, getCountries } from './actions/fetch';
import LoadingGrid from '@/components/general/loading-grid';

export default async function Home() {
  const numberOfCities = 24;
  const cities = await getAllCities(numberOfCities);
  const countries = await getCountries();

  return (
    <Suspense fallback={<LoadingGrid />}>
      <HomeLayout initialCities={cities} countries={countries} />
    </Suspense>
  );
}
