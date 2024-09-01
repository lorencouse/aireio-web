// app/cities/[country]/[state]/[city]/page.tsx

'use server';

import { createClient } from '@/utils/supabase/server';
import PlacesPageLayout from './places-page-layout';
import { Suspense } from 'react';

const Places = async ({
  params
}: {
  params: { country: string; state: string; city: string };
}) => {
  const cityName = params.city;
  const supabase = createClient();

  try {
    const { data: city, error } = await supabase
      .from('cities')
      .select('*')
      .eq('name', cityName)
      .single();

    if (error) {
      throw error;
    }

    if (!city) {
      throw new Error('City not found');
    }

    console.log('city:', city);

    return (
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <Suspense fallback={<div>Loading...</div>}>
          <PlacesPageLayout city={city} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.log('Error fetching city:', error, 'cityName:', cityName);
    return (
      <div>
        Error loading city{' '}
        {/* <span
          className="text-blue-500 underline cursor-pointer hover:text-blue-800"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </span> */}
      </div>
    );
  }
};

export default Places;
