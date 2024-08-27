'use client';

import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import LoadingGrid from '@/components/general/loading-grid';
import GoogleMap from '@/components/places/google-map';
import { Button } from '@/components/ui/button';

import usePlaces from '@/utils/hook/usePlaces';
import { fetchCity } from '@/utils/places/placesUtils';
import { filterByRadius, sortPlaces } from '@/utils/places/sortPlacesUtils';
import { City, Place } from '@/utils/types';

import CityHero from './_components/city-hero';
import PlacesList from './_components/places-list';
import SegmentedTypePicker from './_components/segmented-type-picker';
import SortControl from './_components/sort-control';
import SortOrderPicker from './_components/sort-order-picker';
import LoadingPlace from './[id]/_components/loading-place';

const Places = () => {
  const searchParams = useSearchParams();
  const [placeType, setPlaceType] = useState<'cafe' | 'library' | 'coworking'>(
    'cafe'
  );
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [city, setCity] = useState<City | null>(null);

  const [radius, setRadius] = useState(1000);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [sortMethod, setSortMethod] = useState('');
  const [descending, setDescending] = useState(false);
  const {
    allPlaces,
    isLoading,
    setIsLoading,
    searchNewPlaces,
    loadPlaces,
    searchCompleted,
    setSearchCompleted
  } = usePlaces(city, placeType, coordinates, radius);

  const saveFilterSettingsToLocalStorage = useCallback(
    (city: City) => {
      const settings = {
        radius,
        coordinates,
        sortMethod,
        descending,
        placeType
      };

      localStorage.setItem(
        `filter_settings_${city.name}_${city.id}`,
        JSON.stringify(settings)
      );
    },
    [radius, placeType, coordinates, sortMethod, descending]
  );

  const loadSettingsFromLocalStorage = useCallback((city: City) => {
    if (!city) return;

    const storedSettings = localStorage.getItem(
      `filter_settings_${city.name}_${city.id}`
    );
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setRadius(settings.radius);
      setCoordinates(settings.coordinates);
      setSortMethod(settings.sortMethod);
      setDescending(settings.descending);
      setPlaceType(settings.placeType);
      return settings.placeType;
    }

    return null;
  }, []);

  const handleTypeChange = useCallback(
    (newType: 'cafe' | 'library' | 'coworking') => {
      setPlaceType(newType);
      if (city) {
        loadPlaces(city, newType);
        saveFilterSettingsToLocalStorage(city);
      }
    },
    [city, loadPlaces]
  );

  const handleRefreshClick = () => {
    searchNewPlaces();

    setTimeout(() => {
      setSearchCompleted(true);
      console.log(searchCompleted);
    }, 200);
    console.log(searchCompleted);
  };

  // Fetch City and load places
  useEffect(() => {
    const cityId = searchParams.get('city_id');
    if (cityId) {
      fetchCity(cityId)
        .then((fetchedCity) => {
          setCity(fetchedCity);
          setCoordinates({ lat: fetchedCity.lat, lng: fetchedCity.lng });

          const lastPlaceType =
            loadSettingsFromLocalStorage(fetchedCity) || placeType;
          // Check last filter settings from local storage for given city.id, and set radius, placeType, and coordinates accordingly if they exist
          return loadPlaces(fetchedCity, lastPlaceType);
        })
        .catch((error) => {
          console.error('Error fetching city or loading places:', error);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    setSearchCompleted(false);
    if (allPlaces.length > 0) {
      const placesInRadius = filterByRadius(allPlaces, coordinates, radius);
      const sortedPlaces = sortPlaces(
        placesInRadius,
        sortMethod,
        coordinates,
        descending
      );
      if (sortedPlaces.length === 0 && !searchCompleted) {
        searchNewPlaces();
        setFilteredPlaces([]);
      }
      if (
        sortedPlaces.length > 0 &&
        JSON.stringify(sortedPlaces) !== JSON.stringify(allPlaces)
      ) {
        setFilteredPlaces(sortedPlaces);
        saveFilterSettingsToLocalStorage(city);
      }
      console.log('Filters Updated');
    }
  }, [sortMethod, descending, coordinates, radius, allPlaces]);

  // Whenever there is a change to sortMethod, descending, coordinates, radius or placeType, update current settings in localStorage for current city.id

  if (!city || !coordinates) {
    return <LoadingPlace />;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
      <CityHero city={city} />
      <div className="grid lg:grid-cols-2 w-full">
        <div className="city-map lg:mx-0 sm:mx-12">
          <GoogleMap
            lat={coordinates.lat}
            lng={coordinates.lng}
            radius={radius}
            setRadius={setRadius}
            setCoordinates={setCoordinates}
          />
        </div>
        <div className="city-filters flex flex-col p-10">
          <span className="text-lg font-bold">Filter by:</span>
          <SegmentedTypePicker
            placeType={placeType}
            setPlaceType={handleTypeChange}
          />

          <div className="flex flex-row gap-4 mb-6 justify-between flex-wrap">
            <div className="flex flex-row gap-4 mb-6 justify-between flex-wrap">
              <SortControl
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
              />
              <SortOrderPicker
                descending={descending}
                setDescending={setDescending}
              />
            </div>

            <Button
              variant="outline"
              onClick={handleRefreshClick}
              disabled={isLoading || searchCompleted}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold my-8 select-none">
        Workspaces in {city.name}
      </h1>
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <PlacesList places={filteredPlaces} coordinates={coordinates} />
      )}
    </div>
  );
};

export default Places;
