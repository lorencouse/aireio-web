import { createClient } from '@/utils/supabase/server';
import { City } from '@/utils/types';
import CountryPageLayout from './country-page-layout';

async function getCities(country: string): Promise<City[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_code', country)
    .limit(24);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

export default async function CountryPage({
  params
}: {
  params: { country: string; state: string };
}) {
  const { country, state } = params;
  const cities: City[] = await getCities(country, state);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem]">
      <CountryPageLayout cities={cities} />
    </div>
  );
}
