import { useCallback, useState } from 'react';

import {
  createNewPlaces,
  fetchPlacesFromDatabase,
  fetchPlacesFromGoogle
} from '@/utils/places/placesUtils';
import { City, Place } from '@/utils/types';

const usePlaces = (
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
        if (city[`${placeType}_ids`]?.length) {
          fetchedPlaces = await fetchPlacesFromDatabase(city, placeType);
        } else {
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
          const googlePlaces = await fetchPlacesFromGoogle(
            city,
            placeType,
            radius,
            lat,
            lng
          );
          const newPlaces = await createNewPlaces(
            city,
            placeType,
            googlePlaces
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
    const googlePlaces = await fetchPlacesFromGoogle(
      city,
      placeType,
      radius,
      lat,
      lng
    );
    const newPlaces = await createNewPlaces(city, placeType, googlePlaces);
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

export default usePlaces;