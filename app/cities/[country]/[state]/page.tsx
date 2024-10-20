import { City } from '@/utils/types';
import StatePageLayout from './state-page-layout';
import { Suspense } from 'react';
import LoadingGrid from '@/components/general/loading-grid';
import { getCitiesForState, getCountries } from '@/app/actions/fetch';

export default async function StatePage({
  params
}: {
  params: { country: string; state: string };
}) {
  const { country, state } = params;
  const cities: City[] = await getCitiesForState(country, state);
  const countries: { country: string; country_code: string }[] =
    await getCountries();

  return (
    <Suspense fallback={<LoadingGrid />}>
      <StatePageLayout
        cities={cities}
        stateName={state}
        countries={countries}
      />
    </Suspense>
  );
}
