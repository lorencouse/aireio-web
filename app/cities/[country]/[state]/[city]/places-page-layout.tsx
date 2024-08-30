// app/cities/[country]/[state]/[city]/places-page-layout.tsx

import React from 'react';
import { Briefcase, Coffee, Library } from 'lucide-react';
import SegmentedTypePicker from './_components/segmented-type-picker';
import RadiusSlider from './_components/radius-slider';
import SortMethod from './_components/sort-method';
import SortOrderPicker from './_components/sort-order-picker';
import GoogleMap from './_components/google-map';

export default function PlacesPageLayout({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <div className="grid lg:grid-cols-2 w-full mt-[1rem] p-3">
        <div className="city-map lg:mx-0 sm:mx-12">
          <GoogleMap searchParams={searchParams} />
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
      <h1 className="text-4xl font-bold my-8 select-none">Workspaces</h1>
    </>
  );
}
