'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlacePhotoUrls } from '@/utils/functions/places/getPlacePhotoUrls';
import { Place } from '@/utils/types';
import { MapPin, Coffee, BookOpen, Building, Star } from 'lucide-react';
import { uploadPlacePhotos } from '@/utils/places/uploadPlacePhotos';

interface PlaceCardProps {
  place: Place;
  distance: number;
  setIsLoadingPlace: (isLoadingPlace: boolean) => void;
}

const PlaceCard = ({ place, distance, setIsLoadingPlace }: PlaceCardProps) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    getPlacePhotoUrls(place)
  );

  const fetchMissingPhotos = async () => {
    const photoNames = await uploadPlacePhotos(place);
    const placeWithPhotos = {
      ...place,
      photo_names: photoNames
    };
    setPhotoUrls(getPlacePhotoUrls(placeWithPhotos));
  };

  useEffect(() => {
    if (!place.photo_names || place.photo_names.length === 0) {
      fetchMissingPhotos();
    }
  }, []);

  const router = useRouter();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cafe':
        return <Coffee size={16} className="mr-1" />;
      case 'library':
        return <BookOpen size={16} className="mr-1" />;
      case 'coworking':
        return <Building size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
    setIsLoadingPlace(true);
    router.push(
      `/cities/${place.country_code}/${place.state}/${place.city}/${place.id}`
    );
  };

  return (
    <div
      className="relative md:w-72 sm:w-52 w-44 md:h-52 sm:h-48 h-44 cursor-pointer rounded-lg overflow-hidden shadow-md md:m-4 hover:scale-105 duration-200"
      onClick={handleClick}
    >
      {photoUrls.length > 0 ? (
        <Image
          src={photoUrls[0]}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          style={{ objectFit: 'cover' }}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/logo.png"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <MapPin size={24} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black">
        <h3 className="absolute sm:top-8 top-3 left-4 text-xl font-extrabold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
          {place.name}
        </h3>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span>{place.add_1}</span>
          </div>
          <div className="flex items-center mb-1">
            {getTypeIcon(place.type)}
            <span className="capitalize">{place.type}</span>
          </div>
          <div className="flex justify-between items-center">
            {place.type === 'cafe' && place.price_level && (
              <div className="flex items-center">
                {'$'.repeat(place.price_level)}
              </div>
            )}
            {place.rating_score && (
              <div className="flex items-center">
                <Star size={16} className="mr-1" />
                <span>
                  {place.rating_score} ({place.rating_count})
                </span>
              </div>
            )}
            <div>{distance.toFixed(1)} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
