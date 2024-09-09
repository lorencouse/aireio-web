import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import getSupabasePlacePhotoUrls from '@/utils/functions/places/getSupabasePlacePhotoUrl';
import { uploadPlacePhotosToSupabase } from '@/utils/places/placesUtils';
import { placeholderImage } from '@/utils/constants';

interface PlaceCardProps {
  place: Place;
  distance: number;
}

const PlaceCard = ({ place, distance }: PlaceCardProps) => {
  const router = useRouter();
  const [photoUrls, setPhotoUrls] = useState<string[]>([placeholderImage]);

  const fetchPhotos = async () => {
    const urls = await getSupabasePlacePhotoUrls(place.city_id, place.id);

    if (urls.length === 0 || urls[0] === placeholderImage) {
      const newUrls = await uploadPlacePhotosToSupabase(place);
      setPhotoUrls(newUrls);
    } else {
      setPhotoUrls(urls);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

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
