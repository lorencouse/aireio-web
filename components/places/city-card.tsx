'use client';

import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Adjust this import based on your project structure

import useGetCityPhoto from '@/utils/hook/useGetCityPhoto';
import { City } from '@/utils/types';
import Link from 'next/link';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const { imageUrl } = useGetCityPhoto(city);

  return (
    <Link
      href={`/places?city_id=${city.id}&place_type=cafe&lat=${city.lat}&lng=${city.lng}&radius=1000&sort_method=distance&sort_order=asc`}
    >
      <div className="relative w-96 h-64 cursor-pointer rounded-lg overflow-hidden shadow-md m-4 hover:scale-105 duration-200 ">
        {city.photo_ref ? (
          <Image
            src={imageUrl || '/images/logo.png'}
            alt={`${city.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Avatar className="w-24 h-24">
            <AvatarFallback>{city.name[0]}</AvatarFallback>
          </Avatar>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center flex-col">
          <h3 className="text-white text-4xl font-bold text-center text-shadow select-none mb-1">
            {city.name}
          </h3>
          <h4 className="text-white text-lg font-bold text-center text-shadow select-none">
            {city.country}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;
