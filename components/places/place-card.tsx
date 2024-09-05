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

interface PlaceCardProps {
  place: Place;
  distance: number;
}

const PlaceCard = ({ place, distance }: PlaceCardProps) => {
  const router = useRouter();
  const [photoDataUrl, setPhotoDataUrl] = useState('/images/logo.png');

  useEffect(() => {
    const fetchPhoto = async () => {
      if (place.photos && place.photos.length > 0) {
        try {
          const response = await axios.get(
            `/api/cities/place-photo?photoReference=${place.photos[0].ref}&maxWidth=400`,
            {
              responseType: 'arraybuffer'
            }
          );

          const contentType = response.headers['content-type'];
          const base64String = Buffer.from(response.data, 'binary').toString(
            'base64'
          );
          const dataUrl = `data:${contentType};base64,${base64String}`;

          setPhotoDataUrl(dataUrl);
        } catch (error) {
          console.error('Error fetching photo:', error);
        }
      }
    };

    fetchPhoto();
  }, [place.photos]);

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
          src={photoDataUrl}
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
