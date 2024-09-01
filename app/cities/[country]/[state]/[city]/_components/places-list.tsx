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
  const { allPlaces, isLoading } = useGetPlaces(city, searchParams);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(allPlaces);

  useEffect(() => {
    // Filter places based on search params
    const {
      radius,
      lat,
      lng,
      place_type,
      sort_method: sortMethod,
      sort_order: sortOrder
    } = searchParams;

    const filteredPlaces = filterAndSortPlaces(
      allPlaces,
      sortMethod,
      { lat, lng },
      radius,
      sortOrder
    );

    setFilteredPlaces(filteredPlaces);
  }, [searchParams, allPlaces]);

  return (
    <div className="flex flex-col items-end">
      <span className="text-lg font-bold pr-4 ">
        Showing {allPlaces ? allPlaces.length : 0} Places
      </span>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
        {allPlaces && allPlaces.length > 0 ? (
          allPlaces.map((place) => (
            <PlaceCard
              place={place}
              distance={calcDistance(coordinates, {
                lat: place.lat,
                lng: place.lng
              })}
              key={place.id}
            />
          ))
        ) : (
          <p>
            No places found. Try adjusting your filters or refreshing from
            Google.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlacesList;
