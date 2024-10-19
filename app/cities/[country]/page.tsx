// import { createClient } from '@/utils/supabase/server';
import { City } from '@/utils/types';
import CountryPageLayout from './country-page-layout';
import { Suspense } from 'react';
import LoadingGrid from '@/components/general/loading-grid';
import { getCitiesForCountry, getCountries } from '@/app/actions/fetch';

export default async function CountryPage({
  params
}: {
  params: { country: string; state: string };
}) {
  const { country } = params;
  const cities: City[] = await getCitiesForCountry(country);
  const countries: { country: string; country_code: string }[] =
    await getCountries();

  return (
    <Suspense fallback={<LoadingGrid />}>
      <CountryPageLayout cities={cities} countries={countries} />
    </Suspense>
  );
}
