'use client';

import React, { useState, useEffect } from 'react';
import PlaceHero from './_components/place-hero';
import PlaceOverviewCard from './_components/place-overview-card';
import PlaceDetails from './_components/place-details';
import PopupPlaceDeleted from './_components/popup-place-deleted';
import { Place } from '@/utils/types';
import { getPlacePhotoUrls } from '@/utils/functions/places/getPlacePhotoUrls';
import LoadingPlace from './_components/loading-place';
import PlaceBreadCrumb from './_components/place-breadcrumb';
import { uploadPlacePhotos } from '@/utils/places/uploadPlacePhotos';

const PlacePageLayout = ({ place: initialPlace }: { place: Place }) => {
  const [showModal, setShowModal] = useState(false);
  const [place, setPlace] = useState(initialPlace);
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    getPlacePhotoUrls(initialPlace)
  );
  const fetchMissingPhotos = async () => {
    const placePhotoNames = await uploadPlacePhotos(place);
    const updatedPlace = {
      ...place,
      photo_names: placePhotoNames
    };
    setPlace(updatedPlace);
    const urls = getPlacePhotoUrls(updatedPlace);
    setPhotoUrls(urls);
    console.log('Photo URLs:', updatedPlace.photo_names);
  };

  useEffect(() => {
    fetchMissingPhotos();
  }, []);

  if (!place) return <LoadingPlace />;

  return (
    <div>
      {place.deleted && (
        <PopupPlaceDeleted
          showModal={showModal}
          setShowModal={setShowModal}
          cityId={place.city_id ? place.city_id : ''}
        />
      )}
      {place && <PlaceBreadCrumb place={place} />}

      <PlaceHero place={place} photoUrl={photoUrls[0]} />
      <PlaceOverviewCard place={place} photoUrls={photoUrls} />
      <PlaceDetails place={place} />
    </div>
  );
};

export default PlacePageLayout;
