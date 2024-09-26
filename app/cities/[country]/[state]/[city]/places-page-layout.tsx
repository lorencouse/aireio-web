'use client';

import React from 'react';
import SegmentedTypePicker from './_components/segmented-type-picker';
import RadiusSlider from './_components/radius-slider';
import SortMethod from './_components/sort-method';
import SortOrderPicker from './_components/sort-order-picker';
import GoogleMap from './_components/google-map';
import { useSearchParams } from 'next/navigation';
import { Place, City } from '@/utils/types';
import CityList from '@/components/homepage/city-list';
import PlacesList from './_components/places-list';
import useGetPlaces from '@/utils/hook/useGetPlaces';
import { filterAndSortPlaces } from '@/utils/places/sortPlacesUtils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import { create } from './page';

export default function PlacesPageLayout({
  city,
  places
}: {
  city: City;
  places;
}) {
  const searchParams = useSearchParams();

  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [allPlaces, setAllPlaces] = useState<Place[]>(places);
  const [isLoading, setIsLoading] = useState(true);
  const [searchComplete, setSearchComplete] = useState(false);

  const handleSearch = async () => {
    await searchNewPlaces(city, searchParams);
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
  };

  // Load places only when city or place_type changes


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
      handleSearch();
    } else {
      setFilteredPlaces(filtered);
      setSearchComplete(false);
      console.log('Filtered places:', filtered.length);
    }
  }, [searchParams, allPlaces]);

  return (
    <>
      <div className="grid lg:grid-cols-2 w-full mt-[1rem] p-3">
        <div className="city-map lg:mx-0 sm:mx-12">
          <GoogleMap searchParams={searchParams} city={city} />
        </div>
        <div className="city-filters flex flex-col p-10">
          <span className="text-lg font-bold">Filter by:</span>
          <SegmentedTypePicker searchParams={searchParams} />
          <div className="flex flex-row gap-4 mb-6 justify-between flex-wrap">
            <SortMethod searchParams={searchParams} />
            <Button onClick={handleSearch}>Search</Button>
            <SortOrderPicker searchParams={searchParams} />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold my-8 select-none">
        Workspaces in {city && city.name.replace(/-/g, ' ')}
      </h1>
      <PlacesList
        filteredPlaces={filteredPlaces}
        searchParams={searchParams}
        city={city}
      />
    </>
  );
}
