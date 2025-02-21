import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Place } from '@/utils/types';

import { placeholderImage } from '@/utils/constants';
import formatPlaceName from '@/utils/functions/formatPlaceName';

interface PlaceHeroProps {
  place: Place;
  photoUrl: string;
}

const PlaceHero: React.FC<PlaceHeroProps> = ({ place, photoUrl }) => {
  const contryFormatted = formatPlaceName(place.country ? place.country : '');
  const cityFormatted = formatPlaceName(place.city ? place.city : '');

  return (
    <div className="relative w-full md:h-[50vh] min-h-[250px] drop-shadow-lg">
      {photoUrl ? (
        <Image
          src={photoUrl || placeholderImage}
          alt={`${place.name}`}
          fill
          style={{ objectFit: 'cover' }}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/logo.png"
          className="rounded-t-2xl"
        />
      ) : (
        <Avatar className="w-24 h-24 rounded-t-2xl">
          <AvatarFallback>{place?.name[0] ?? '?'}</AvatarFallback>
        </Avatar>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6 rounded-t-2xl">
        <h1 className="text-white text-2xl md:text-5xl font-bold text-center px-4 text-shadow-lg select-none">
          {place.name}
        </h1>
        <span className="text-white text-lg md:text-xl font-bold text-center px-4 text-shadow-lg select-none">
          {cityFormatted && `${cityFormatted},`} {contryFormatted}
        </span>
      </div>
    </div>
  );
};

export default PlaceHero;
