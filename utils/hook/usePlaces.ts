import { useCallback, useState } from 'react';

import {
  createNewPlaces,
  fetchPlacesFromDatabase,
  fetchPlacesFromGoogle
} from '@/utils/places/placesUtils';
import { City, Place } from '@/utils/types';

const usePlaces = (
  city: City | null,
  placeType: 'cafe' | 'library' | 'coworking',
  coordinates: { lat: number; lng: number } | null,
  radius: number
) => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const loadPlaces = useCallback(
    async (city: City, placeType: 'cafe' | 'library' | 'coworking') => {
      setIsLoading(true);
      try {
        let fetchedPlaces: Place[] = [];
        if (city[`${placeType}_ids`]?.length) {
          fetchedPlaces = await fetchPlacesFromDatabase(city, placeType);
        } else {
          const lat = coordinates?.lat || city.lat;
          const lng = coordinates?.lng || city.lng;
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

  const searchNewPlaces = async () => {
    if (!city || !coordinates) return;
    setIsLoading(true);

    console.log('Searching new places');
    const googlePlaces = await fetchPlacesFromGoogle(
      city,
      placeType,
      radius,
      coordinates.lat,
      coordinates.lng
    );
    const newPlaces = await createNewPlaces(city, placeType, googlePlaces);
    setAllPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);
    setIsLoading(false);
    // setTimeout(() => {
    setSearchCompleted(true);
    //   console.log(searchCompleted);
    // }, 100);
  };

  return {
    allPlaces,
    isLoading,
    setIsLoading,
    searchNewPlaces,
    loadPlaces,
    searchCompleted,
    setSearchCompleted
  };
};

export default usePlaces;
