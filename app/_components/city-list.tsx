import React from 'react';
import CityCard from './city-card';
import { City } from '@/utils/types';

const CityList = ({ cities }: { cities: City[] }) => {
  if (!cities || cities.length === 0) {
    return <div>No cities found.</div>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cities.map((city) => (
        <CityCard key={city.id} city={city} />
      ))}
    </div>
  );
};

export default CityList;
