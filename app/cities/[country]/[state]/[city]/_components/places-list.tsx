'use client';
import React, { useState, useEffect } from 'react';
import PlaceCard from '@/components/places/place-card';
import calcDistance from '@/utils/places/calcDistance';
import { City, Place } from '@/utils/types';
import useGetPlaces from '@/utils/hook/useGetPlaces';
import { filterAndSortPlaces } from '@/utils/places/sortPlacesUtils';
import { useSearchParams } from 'next/navigation';

const PlacesList = ({ filteredPlaces, searchParams, city }: { filteredPlaces: Place[], searchParams: URLSearchParams, city: City }) => {
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
                  lat: parseFloat(
                    searchParams.get('lat') || city.lat.toString()
                  ),
                  lng: parseFloat(
                    searchParams.get('lng') || city.lng.toString()
                  )
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
