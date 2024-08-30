import React from 'react';

import PlaceCard from '@/components/places/place-card';

import calcDistance from '@/utils/places/calcDistance';
import { Place } from '@/utils/types';

const PlacesList = ({
  places,
  coordinates,
}: {
  places: Place[];
  coordinates: { lat: number; lng: number };
}) => {
  return (
    <div className='flex flex-col items-end'>
      <span className='text-lg font-bold pr-4 '>
        Showing {places ? places.length : 0} places
      </span>
      <div className='grid xl:grid-cols-3 lg:grid-cols-2 gap-4'>
        {places && places.length > 0 ? (
          places.map((place) => (
            <PlaceCard
              place={place}
              distance={calcDistance(coordinates, {
                lat: place.lat,
                lng: place.lng,
              })}
              key={place.id}
            />
          ))
        ) : (
          <p>
            No places found. Try adjusting your filters or refreshing from
            Google.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlacesList;
