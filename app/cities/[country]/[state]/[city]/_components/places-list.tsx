'use client';
import React, { useState, useEffect } from 'react';
import PlaceCard from '@/components/places/place-card';
import calcDistance from '@/utils/places/calcDistance';
import { City, Place } from '@/utils/types';
import useGetPlaces from '@/utils/hook/useGetPlaces';
import { filterAndSortPlaces } from '@/utils/places/sortPlacesUtils';
import { useSearchParams } from 'next/navigation';

const PlacesList = ({
  city,
  searchParams,
  places
}: {
  city: City;
  searchParams: { [key: string]: string | string[] | undefined };
  places: Place[];
}) => {
  const { allPlaces, isLoading, loadPlaces, searchNewPlaces } = useGetPlaces(
    city,
    searchParams
  );
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [searchComplete, setSearchComplete] = useState(false);

  // Load places only when city or place_type changes
  useEffect(() => {
    const fetchPlaces = async () => {
      await loadPlaces(city, searchParams);
    };
    fetchPlaces();
  }, []);

  // Update filtered places when search params or allPlaces change
  useEffect(() => {
    if (!allPlaces || allPlaces.length === 0) return;

    const radius = searchParams.get('radius')
      ? parseInt(searchParams.get('radius')!)
      : 1000;
    const lat = searchParams.get('lat')
      ? parseFloat(searchParams.get('lat')!)
      : city.lat;
    const lng = searchParams.get('lng')
      ? parseFloat(searchParams.get('lng')!)
      : city.lng;
    const type = searchParams.get('place_type') || 'cafe';

    const sortMethod = searchParams.get('sort_method') || 'distance';
    const sortOrder = searchParams.get('sort_order') || 'asc';

    const filtered = filterAndSortPlaces(
      allPlaces,
      type,
      sortMethod,
      lat,
      lng,
      radius,
      sortOrder as 'asc' | 'des'
    );

    if (filtered.length === 0 && !searchComplete) {
      searchNewPlaces(city, searchParams);
      const newFiltered = filterAndSortPlaces(
        allPlaces,
        type,
        sortMethod,
        lat,
        lng,
        radius,
        sortOrder as 'asc' | 'des'
      );

      setFilteredPlaces(newFiltered);
      setSearchComplete(true);
    } else {
      setFilteredPlaces(filtered);
      setSearchComplete(false);
      console.log('Filtered places:', filtered.length);
    }
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
