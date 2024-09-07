import { useCallback, useState } from 'react';

import {
  createNewPlaces,
  fetchPlacesFromDatabase,
  createAndReturnGooglePlaces
} from '@/utils/places/placesUtils';
import { City, Place } from '@/utils/types';

const useGetPlaces = (
  city: City,
  searchParams: { [key: string]: string | string[] | undefined }
) => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlaces = useCallback(
    async (city: City, searchParams: { [key: string]: string | string[] }) => {
      setIsLoading(true);
      const placeType = searchParams.get('place_type') || 'cafe';
      try {
        let fetchedPlaces: Place[] = [];

        fetchedPlaces = await fetchPlacesFromDatabase(city);
        // } else {
        if (fetchedPlaces.length === 0) {
          const radius = searchParams.get('radius') || '1000';
          const lat = searchParams.get('lat') || city.lat.toString();
          const lng = searchParams.get('lng') || city.lng.toString();
          console.log(
            'lat:',
            lat,
            'lng:',
            lng,
            'radius:',
            radius,
            'placeType:',
            placeType
          );
          const newPlaces = await createAndReturnGooglePlaces(
            city,
            placeType,
            radius,
            lat,
            lng
          );
          fetchedPlaces = [...fetchedPlaces, ...newPlaces];
        }
        setAllPlaces(fetchedPlaces);
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const searchNewPlaces = async (
    city: City,
    searchParams: { [key: string]: string | string[] }
  ) => {
    if (!city) return;
    setIsLoading(true);

    const placeType = searchParams.get('place_type') || 'cafe';
    const radius = searchParams.get('radius') || '1000';
    const lat = searchParams.get('lat') || city.lat.toString();
    const lng = searchParams.get('lng') || city.lng.toString();

    console.log('Searching new places');
    const newPlaces = await createAndReturnGooglePlaces(
      city,
      placeType,
      radius,
      lat,
      lng
    );
    setAllPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);
    setIsLoading(false);
  };

  return {
    allPlaces,
    isLoading,
    searchNewPlaces,
    loadPlaces
  };
};

export default useGetPlaces;
