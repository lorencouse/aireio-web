import React from 'react';

import CityCard from './city-card';

import { City } from '@/utils/types';

const CityList = ({ cities }: { cities: City[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cities.map((city) => (
        <div key={city.id}>
          <CityCard key={city.id} city={city} />
        </div>
      ))}
    </div>
  );
};

export default CityList;
