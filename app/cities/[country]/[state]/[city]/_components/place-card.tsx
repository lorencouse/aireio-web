import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { getPlacePhotoUrls } from '@/utils/functions/places/getPlacePhotoUrls';
import { Place } from '@/utils/types';
import { MapPin, Coffee, BookOpen, Building, Star } from 'lucide-react';
interface PlaceCardProps {
  place: Place;
  distance: number;
  setIsLoadingPlace: (isLoadingPlace: boolean) => void;
}

const PlaceCard = ({ place, distance, setIsLoadingPlace }: PlaceCardProps) => {
  const photoUrls = getPlacePhotoUrls(place);

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

    // Scroll to top of page
    router.push(
      `/cities/${place.country_code}/${place.state}/${place.city}/${place.id}`
    );
  };

  return (
    <Card
      className="md:w-96 w-80 hover:scale-105 transition-transform duration-200 cursor-pointer bg-background text-foreground relative overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative w-full md:h-64 h-52">
        <Image
          src={photoUrls[0]}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="rounded-md"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/logo.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-4 text-white">
          <h3 className="text-xl font-bold mb-2">{place.name}</h3>
          <div className="flex items-center text-sm mb-1">
            <MapPin size={16} className="mr-1" />
            <span>{place.add_1}</span>
          </div>
          <div className="flex items-center text-sm mb-1">
            {getTypeIcon(place.type)}
            <span className="capitalize">{place.type}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            {place.type === 'cafe' && (
              <div className="flex items-center">
                {/* <DollarSign size={16} className="mr-1" /> */}
                {place.price_level ? (
                  Array.from({ length: place.price_level }, (_, i) => (
                    <span key={i}>$</span>
                  ))
                ) : (
                  <span>?</span>
                )}
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
    </Card>
  );
};

export default PlaceCard;
