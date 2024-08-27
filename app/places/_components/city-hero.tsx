import Image from 'next/image';
import React from 'react';

import useGetCityPhoto from '@/utils/hook/useGetCityPhoto';

import { City } from '@/types';

interface CityHeroProps {
  city: City;
}

const CityHero: React.FC<CityHeroProps> = ({ city }) => {
  const { imageUrl } = useGetCityPhoto(city);

  return (
    <div className='relative w-full h-[50vh] min-h-[400px]'>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${city.name} cityscape`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      ) : (
        <Image
          src='/images/logo.png' // Provide a default image path
          alt='Default city image'
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      )}
      <div className='absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6'>
        <h1 className='text-white text-4xl md:text-6xl font-bold text-center px-4 text-shadow-lg select-none'>
          {city.name}
        </h1>
        <span className='text-white text-xl md:text-2xl font-bold text-center px-4 text-shadow-lg select-none'>
          {city.country}
        </span>
      </div>
    </div>
  );
};

export default CityHero;
