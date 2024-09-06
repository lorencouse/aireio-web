import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import getSupabasePlacePhotoUrl from '@/utils/functions/places/getSupabasePlacePhotoIrl';

interface PlaceCardProps {
  place: Place;
  distance: number;
}

const PlaceCard = ({ place, distance }: PlaceCardProps) => {
  const router = useRouter();
  const [photoDataUrl, setPhotoDataUrl] = useState('/images/logo.png');

  const photoUrl =  getSupabasePlacePhotoUrl(place.type, place.photos[0]?.ref)


  return (
    <Card
      className="w-96 hover:scale-105 transition-transform duration-200 m-4 cursor-pointer"
      onClick={() =>
        router.push(
          `/cities/${place.address.country_code}/${place.address.state}/${place.address.city}/${place.id}`
        )
      }
    >
      <div className="relative w-full h-52">
        <Image
          src={photoUrl}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="rounded-t-md"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{place.name}</CardTitle>
        <CardDescription className="flex items-center">
          {place.address.add_1}
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
            {place.tags.cost ? (
              Array.from({ length: place.tags.cost }, (_, i) => (
                <span key={i}>$</span>
              ))
            ) : (
              <span>?</span>
            )}
          </div>
        )}
        {place.google_rating.score ? (
          <div className="text-sm">
            {place.google_rating.score} ⭐ ({place.google_rating.count})
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
