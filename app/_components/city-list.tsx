import React from 'react';
import CityCard from './city-card';
import { City } from '@/utils/types';

const CityList = ({ cities, heading }: { cities: City[]; heading: string }) => {
  if (!cities || cities.length === 0) {
    return <div>No cities found.</div>;
  }

  return (
    <>
      <h2 className="text-2xl w-full font-bold select-none px-4 border-b mb-6 py-6 text-center ">
        {heading}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </>
  );
};

export default CityList;
