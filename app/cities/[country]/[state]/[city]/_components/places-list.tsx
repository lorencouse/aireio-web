import React from 'react';
import PlaceCard from '@/app/cities/[country]/[state]/[city]/_components/place-card';
import { City, Place } from '@/utils/types';
import calcDistance from '@/utils/places/calcDistance';

const PlacesList = ({
  filteredPlaces,
  searchParams,
  city
}: {
  filteredPlaces: Place[];
  searchParams: URLSearchParams;
  city: City;
}) => {
  return (
    <div className="flex flex-col items-end">
      <span className="text-lg font-bold pr-4 ">
        Showing {filteredPlaces.length} Places
      </span>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard
              place={place}
              distance={calcDistance(
                {
                  lat: parseFloat(
                    searchParams.get('lat') || city.lat.toString()
                  ),
                  lng: parseFloat(
                    searchParams.get('lng') || city.lng.toString()
                  )
                },
                { lat: place.lat, lng: place.lng }
              )}
              key={place.id}
            />
          ))
        ) : (
          <p>No places found. Try adjusting your filters or refreshing.</p>
        )}
      </div>
    </div>
  );
};

export default PlacesList;
