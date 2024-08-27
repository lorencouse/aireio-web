import { useRouter } from 'next/navigation';
import React from 'react';

import CityCard from '@/components/places/city-card';

import { City } from '@/utils/types';

const CityList = ({ cities }: { cities: City[] }) => {
  const router = useRouter();
  const handleCardClick = (city: City) => {
    router.push(`/places?city_id=${city.id}`);
  };
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {cities.map((city) => (
        <div key={city.id} onClick={() => handleCardClick(city)}>
          <CityCard key={city.id} city={city} />
        </div>
      ))}
    </div>
  );
};

export default CityList;
