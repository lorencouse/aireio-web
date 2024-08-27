'use client';

import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Place } from '@/types/place';

interface PlaceHeroProps {
  place: Place;
  photoUrl: string;
}

const PlaceHero: React.FC<PlaceHeroProps> = ({ place, photoUrl }) => {
  return (
    <div className='relative w-full h-[50vh] min-h-[400px]'>
      {photoUrl ? (
        <Image
          src={photoUrl || '/images/logo.png'}
          alt={`${place.name}`}
          width={1200}
          height={600}
          className='object-cover w-full h-full'
          priority
        />
      ) : (
        <Avatar className='w-24 h-24'>
          <AvatarFallback>{place.name[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className='absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6'>
        <h1 className='text-white text-4xl md:text-6xl font-bold text-center px-4 text-shadow-lg select-none'>
          {place.name}
        </h1>
        <span className='text-white text-xl md:text-2xl font-bold text-center px-4 text-shadow-lg select-none'>
          {`${place.address.city || place.address.state || ''}, 
          ${place.address.country}`}
        </span>
      </div>
    </div>
  );
};

export default PlaceHero;
