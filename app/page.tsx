import { Suspense } from 'react';

import useSupabase from '@/utils/hook/useSupabase';

import HomeClient from './home-client';

import { City } from '@/types/place';

import { createClient } from '@/utils/supabase/server';
import LoadingGrid from '@/components/general/loading-grid';

async function getCities(): Promise<City[]> {
  // This line opts out of caching for this data fetch
  // noStore();

  const supabase = createClient();

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
    <Suspense fallback={<LoadingGrid />}>
      <HomeClient initialCities={cities} />
    </Suspense>
  );
}
