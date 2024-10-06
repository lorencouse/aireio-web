import { Suspense } from 'react';

import HomeLayout from './home-layout';

import { City } from '@/utils/types';
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
      <HomeLayout initialCities={cities} />
    </Suspense>
  );
}
