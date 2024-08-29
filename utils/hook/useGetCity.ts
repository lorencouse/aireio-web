'use client';

import { useRouter } from 'next/navigation';
import { PlaceResult } from '@/utils/types';

const useGetCity = () => {
  const router = useRouter();

  const onPlaceSelected = async (city: PlaceResult) => {
    try {
      // First, check if the city exists
      const checkResponse = await fetch('/api/cities/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ google_id: city.place_id })
      });

      if (!checkResponse.ok) {
        throw new Error('Failed to check city existence');
      }

      const { exists, cityId } = await checkResponse.json();

      if (exists) {
        router.push(`/places?city_id=${cityId}`);
        return;
      }

      // If the city doesn't exist, create it
      const createResponse = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(city)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Error response from server:', errorData);
        throw new Error(
          `Failed to create city: ${errorData.details || 'Unknown error'}`
        );
      }

      const photoUrl = city.photos[0].getUrl();
      console.log('Photo URL:', photoUrl);

      const imageResponse = await fetch('/api/cities/google-city-photo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { cityId: newCityId } = await createResponse.json();
      router.push(`/places?city_id=${newCityId}`);
    } catch (error) {
      console.error('Detailed error in onPlaceSelected:', error);
      alert(`An error occurred while processing the city: ${error.message}`);
    }
  };

  return { onPlaceSelected };
};

export default useGetCity;
