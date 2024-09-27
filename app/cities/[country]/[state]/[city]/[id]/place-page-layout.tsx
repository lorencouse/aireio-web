'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlaceHero from './_components/place-hero';
import PlaceOverviewCard from './_components/place-overview-card';
import PlaceDetails from './_components/place-details';
import PopupPlaceDeleted from './_components/popup-place-deleted';
import { Place } from '@/utils/types';
import { getPlacePhotoUrls } from '@/utils/functions/places/getPlacePhotoUrls';
import LoadingPlace from './_components/loading-place';
const PlacePageLayout = ({ place }: { place: Place }) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const photoUrls = getPlacePhotoUrls(place);

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
      <PlaceHero place={place} photoUrl={photoUrls[0]} />
      <PlaceOverviewCard place={place} photoUrls={photoUrls} />

      <PlaceDetails place={place} />
    </div>
  );
};

export default PlacePageLayout;
