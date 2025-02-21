import React from 'react';
import PlaceCard from '@/app/cities/[country]/[state]/[city]/_components/place-card';
import { City, Place } from '@/utils/types';
import calcDistance from '@/utils/places/calcDistance';

const PlacesList = ({
  filteredPlaces,
  searchParams,
  city,
  setIsLoadingPlace
}: {
  filteredPlaces: Place[];
  searchParams?: URLSearchParams | null;
  city?: City;
  setIsLoadingPlace: (isLoadingPlace: boolean) => void;
}) => {
  return (
    <div className="flex flex-col items-end ">
      <span className="text-base pr-1 mt-4">
        Showing {filteredPlaces.length} Places
      </span>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4 items-center">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard
              place={place}
              distance={calcDistance(
                {
                  lat: parseFloat(
                    searchParams?.get('lat') ||
                      city?.lat.toString() ||
                      place.lat.toString()
                  ),
                  lng: parseFloat(
                    searchParams?.get('lng') ||
                      city?.lng.toString() ||
                      place.lng.toString()
                  )
                },
                { lat: place.lat, lng: place.lng }
              )}
              setIsLoadingPlace={setIsLoadingPlace}
              key={place.id}
            />
          ))
        ) : (
          <p className="col-span-full">
            No places found. Try adjusting your filters or refreshing.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlacesList;
