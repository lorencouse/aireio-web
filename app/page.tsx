import { unstable_noStore as noStore } from 'next/cache';
import { Suspense } from 'react';

import useSupabase from '@/utils/hook/useSupabase';

import HomeClient from './home-client';

import { City } from '@/types/place';

async function getCities(): Promise<City[]> {
  // This line opts out of caching for this data fetch
  noStore();

  const supabase = useSupabase();

  const { data, error } = await supabase.from('cities').select('*').limit(24);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const cities = await getCities();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient initialCities={cities} />
    </Suspense>
  );
}
