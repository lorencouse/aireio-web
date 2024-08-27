// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

import createNewCity from '@/utils/functions/places/createNewCity';

// import { Database } from '@/types/supabase';
import useSupabase from './useSupabase';

const useGetCity = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabase();

  const handleCitySelected = async (city: PlaceResult) => {
    setIsLoading(true);
    console.log('City selected: ', city);

    try {
      const { data: existingCity, error } = await supabase
        .from('cities')
        .select('google_id')
        .eq('google_id', city.place_id)
        .maybeSingle();

      if (error) throw error;

      let cityId: string;

      if (!existingCity) {
        const result = await createNewCity(city);
        if ('error' in result) {
          throw result.error;
        }
        cityId = result.cityId;
      } else {
        cityId = existingCity.id;
      }

      setSelectedCityId(cityId);
    } catch (error) {
      console.error('Error checking/creating city:', error);
      alert('An error occurred while processing the city. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedCityId,
    isLoading,
    handleCitySelected
  };
};

export default useGetCity;
