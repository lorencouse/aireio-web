'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlaceHero from './_components/place-hero';
import PlaceOverviewCard from './_components/place-overview-card';
import PlaceDetails from './_components/place-details';
import LoadingPlace from './_components/loading-place';
import PopupPlaceDeleted from './_components/popup-place-deleted';
import { Place } from '@/utils/types';
const PlacePageLayout = ({
  place,
  photoUrls
}: {
  place: Place;
  photoUrls: string[];
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  if (!place) return <LoadingPlace />;

  return (
    <div>
      <PopupPlaceDeleted
        showModal={showModal}
        setShowModal={setShowModal}
        cityId={place.address.city_id}
      />
      <PlaceHero place={place} photoUrl={photoUrls[0]} />
      <PlaceOverviewCard place={place} photoUrls={photoUrls} />

      <PlaceDetails place={place} />
    </div>
  );
};

export default PlacePageLayout;
