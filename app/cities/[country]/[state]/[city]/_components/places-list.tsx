'use client';

import React, { useState, useEffect } from 'react';
import PlaceCard from '@/components/places/place-card';
import calcDistance from '@/utils/places/calcDistance';
import { City, Place } from '@/utils/types';
import useGetPlaces from '@/utils/hook/useGetPlaces';
import { filterAndSortPlaces } from '@/utils/places/sortPlacesUtils';

const PlacesList = ({
  city,
  searchParams
}: {
  city: City;
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { allPlaces, isLoading, loadPlaces } = useGetPlaces(city, searchParams);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]); // Initialize as empty array

  useEffect(() => {
    const fetchPlaces = async () => {
      await loadPlaces(city, searchParams);
    };

    fetchPlaces();
  }, [city, searchParams.place_type]); // Added city as a dependency

  useEffect(() => {
    if (!allPlaces || allPlaces.length === 0) return; // Avoid unnecessary filtering

    // Filter places based on search params
    const radius = searchParams.radius || '1000';
    const lat = searchParams.lat || city.lat.toString();
    const lng = searchParams.lng || city.lng.toString();
    const placeType = searchParams.place_type || 'cafe';
    const sortMethod = searchParams.sort_method || 'distance';
    const sortOrder = searchParams.sort_order || 'asc';

    const filtered = filterAndSortPlaces(
      allPlaces,
      sortMethod,
      lat,
      lng,
      radius,
      sortOrder
    );
    console.log(searchParams);

    setFilteredPlaces(filtered);
  }, [searchParams, allPlaces]);

  return (
    <div className="flex flex-col items-end">
      <span className="text-lg font-bold pr-4 ">
        Showing {filteredPlaces.length} Places
      </span>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard
              place={place}
              distance={calcDistance(
                {
                  lat: parseFloat(searchParams.lat || city.lat.toString()),
                  lng: parseFloat(searchParams.lng || city.lng.toString())
                },
                { lat: place.lat, lng: place.lng }
              )}
              key={place.id}
            />
          ))
        ) : (
          <p>No places found. Try adjusting your filters or refreshing.</p>
        )}
      </div>
    </div>
  );
};
export default PlacesList;
