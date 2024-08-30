import React from 'react';
import { Briefcase, Coffee, Library } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SegmentedTypePicker from './_components/segmented-type-picker';
import RadiusSlider from './_components/radius-slider';
import updateUrlQuery from '@/utils/updateUrlQuery';
import SortMethod from './_components/sort-method';
import SortOrderPicker from './_components/sort-order-picker';
import GoogleMap from './_components/google-map';

const placeTypes = [
  { value: 'cafe', icon: Coffee, label: 'Cafe' },
  { value: 'library', icon: Library, label: 'Library' },
  { value: 'coworking', icon: Briefcase, label: 'Coworking' }
];
const sortMethods = ['distance', 'price', 'rating', 'rating-count'];
const sortOrders = ['asc', 'desc'];

const Places = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const cityId = (searchParams.city_id as string) || '';
  const lat = (searchParams.lat as string) || '';
  const lng = (searchParams.lng as string) || '';
  const radius = (searchParams.radius as string) || '1000';
  // const sortMethod = (searchParams.sort_method as string) || 'distance';


  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
      <div className="grid lg:grid-cols-2 w-full">
        <div className="city-map lg:mx-0 sm:mx-12">
          <div>
            <GoogleMap searchParams={searchParams} />
            {/* <div style={{ height: '400px', width: '100%' }} />
            <RadiusSlider initialRadius={radius} searchParams={searchParams} /> */}
          </div>
        </div>
        <div className="city-filters flex flex-col p-10">
          <span className="text-lg font-bold">Filter by:</span>

          <SegmentedTypePicker
            searchParams={searchParams}
          />

          <div className="flex flex-row gap-4 mb-6 justify-between flex-wrap">
            <SortMethod searchParams={searchParams} />
            <SortOrderPicker
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold my-8 select-none">
        Workspaces in {cityId}
      </h1>
    </div>
  );
};

export default Places;
