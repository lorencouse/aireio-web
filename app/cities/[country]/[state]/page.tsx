import { createClient } from '@/utils/supabase/server';
import { City } from '@/utils/types';
import StatePageLayout from './state-page-layout';

async function getCities(country: string, state: string): Promise<City[]> {
  // This line opts out of caching for this data fetch
  // noStore();

  const supabase = createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('state', state)
    .eq('country_code', country)
    .limit(24);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

export default async function StatePage({
  params
}: {
  params: { country: string; state: string };
}) {
  const { country, state } = params;
  const cities: City[] = await getCities(country, state);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem]">
      <StatePageLayout
        cities={cities}
        stateName={state}
        countryCode={country}
      />
    </div>
  );
}
