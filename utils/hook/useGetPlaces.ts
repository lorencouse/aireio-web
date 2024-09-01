import { useCallback, useState, useEffect } from 'react';

import {
  createNewPlaces,
  fetchPlacesFromDatabase,
  fetchPlacesFromGoogle
} from '@/utils/places/placesUtils';
import { City, Place } from '@/utils/types';

const useGetPlaces = (
  city: City | null,
  searchParams: { [key: string]: string | string[] | undefined }
) => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    place_type: placeType,
    lat: paramsLat,
    lng: paramsLng,
    radius
  } = searchParams;

  const loadPlaces = useCallback(async () => {
    if (!city || !placeType) return;
    setIsLoading(true);
    try {
      let fetchedPlaces: Place[] = [];
      if (city[`${placeType}_ids`]?.length) {
        console.log('Fetching places from database');
        fetchedPlaces = await fetchPlacesFromDatabase(city, placeType);
      } else {
        console.log('Fetching places from Google');
        const lat = paramsLat || city.lat || 0;
        const lng = paramsLng || city.lng || 0;
        const googlePlaces = await fetchPlacesFromGoogle(
          city,
          placeType,
          radius,
          lat,
          lng
        );
        const newPlaces = await createNewPlaces(city, placeType, googlePlaces);
        fetchedPlaces = [...fetchedPlaces, ...newPlaces];
      }
      setAllPlaces(fetchedPlaces);
    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setIsLoading(false);
    }
  }, [city, placeType, paramsLat, paramsLng, radius]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces, placeType]);

  return {
    allPlaces
  };
};

export default useGetPlaces;
