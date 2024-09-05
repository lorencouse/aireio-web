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

export default function PlacesPageLayout({ city }: { city: City }) {
  const searchParams = useSearchParams();

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
            <SortOrderPicker searchParams={searchParams} />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold my-8 select-none">
        Workspaces in {city && city.name.replace(/-/g, ' ')}
      </h1>
      <PlacesList city={city} searchParams={searchParams} />
    </>
  );
}
