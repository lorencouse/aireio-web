'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import updateUrlQuery from '@/utils/updateUrlQuery';

const RadiusSlider = ({ initialRadius, searchParams }: { initialRadius: string, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const router = useRouter();

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = event.target.value;
    const newUrl = updateUrlQuery('radius', newRadius, searchParams);
    router.replace(`?${newUrl}`, { scroll: false });
  };

  return (
    <div className="flex items-center mt-4 mx-4">
      <label htmlFor="radius" className="mr-2">
        Radius:
      </label>
      <input
        type="range"
        id="radius"
        min="500"
        max="4000"
        step="500"
        defaultValue={initialRadius}
        onChange={handleRadiusChange}
        className="w-full"
      />
      <span className="ml-2">{parseInt(initialRadius) / 1000} km</span>
    </div>
  );
};

export default RadiusSlider;
