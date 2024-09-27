import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getPlacePhotoUrls } from '@/utils/functions/places/getPlacePhotoUrls';
import { placeholderImage } from '@/utils/constants';
import { Place } from '@/utils/types';

interface PlaceCardProps {
  place: Place;
  distance: number;
}

const PlaceCard = ({ place, distance }: PlaceCardProps) => {
  const photoUrls = getPlacePhotoUrls(place);

  const router = useRouter();

  return (
    <Card
      className="w-96 hover:scale-105 transition-transform duration-200 m-4 cursor-pointer"
      onClick={() =>
        router.push(
          `/cities/${place.country_code}/${place.state}/${place.city}/${place.id}`
        )
      }
    >
      <div className="relative w-full h-52">
        <Image
          src={photoUrls[0]}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="rounded-t-md"
          priority={true}
          loading="eager"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{place.name}</CardTitle>
        <CardDescription className="flex items-center">
          {place.add_1}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Type: <span className="font-bold capitalize">{place.type}</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-end">
        {place.type === 'cafe' && (
          <div>
            <span className="font-bold">Price: </span>
            {place.price_level ? (
              Array.from({ length: place.price_level }, (_, i) => (
                <span key={i}>$</span>
              ))
            ) : (
              <span>?</span>
            )}
          </div>
        )}
        {place.rating_score ? (
          <div className="text-sm">
            {place.rating_score} ⭐ ({place.rating_count})
          </div>
        ) : (
          <div className="text-sm"></div>
        )}
        <div className="text-sm">{distance.toFixed(1)} km</div>
      </CardFooter>
    </Card>
  );
};

export default PlaceCard;
