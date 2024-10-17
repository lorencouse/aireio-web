import React from 'react';
import SegmentedTypePicker from './segmented-type-picker';
import SortMethod from './sort-method';
import SortOrderPicker from './sort-order-picker';
import { ReadonlyURLSearchParams } from 'next/navigation';

const Filters = ({
  searchParams
}: {
  searchParams: ReadonlyURLSearchParams | null;
}) => {
  return (
    <div className="city-filters flex flex-col p-4">
      <div className="flex flex-row gap-4 flex-wrap w-full items-center  ">
        <span className="text-lg font-bold">Filter by:</span>
        <SegmentedTypePicker searchParams={searchParams} />
        <SortMethod searchParams={searchParams} />
        <SortOrderPicker searchParams={searchParams} />
      </div>
    </div>
  );
};

export default Filters;
