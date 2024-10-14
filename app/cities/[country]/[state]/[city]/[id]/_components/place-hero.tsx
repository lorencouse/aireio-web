import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Place } from '@/utils/types';

import { placeholderImage } from '@/utils/constants';

interface PlaceHeroProps {
  place: Place;
  photoUrl: string;
}

const PlaceHero: React.FC<PlaceHeroProps> = ({ place, photoUrl }) => {
  console.log(photoUrl);
  return (
    <div className="relative w-full md:h-[50vh] min-h-[250px]">
      {photoUrl ? (
        <Image
          src={photoUrl || placeholderImage}
          alt={`${place.name}`}
          fill
          style={{ objectFit: 'cover' }}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/logo.png"
        />
      ) : (
        <Avatar className="w-24 h-24">
          <AvatarFallback>{place?.name[0] ?? '?'}</AvatarFallback>
        </Avatar>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6">
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4 text-shadow-lg select-none">
          {place.name}
        </h1>
        <span className="text-white text-lg md:text-xl font-bold text-center px-4 text-shadow-lg select-none">
          {`${place.city || place.state || ''}, 
          ${place.country || place.country_code || ''}`}
        </span>
      </div>
    </div>
  );
};

export default PlaceHero;
