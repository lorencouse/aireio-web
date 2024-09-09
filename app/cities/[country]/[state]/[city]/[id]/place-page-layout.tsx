'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlaceHero from './_components/place-hero';
import PlaceOverviewCard from './_components/place-overview-card';
import PlaceDetails from './_components/place-details';
import LoadingPlace from './_components/loading-place';
import PopupPlaceDeleted from './_components/popup-place-deleted';
import { Place } from '@/utils/types';
import { uploadPlacePhotosToSupabase } from '@/utils/places/placesUtils';
import getSupabasePlacePhotoUrls from '@/utils/functions/places/getSupabasePlacePhotoUrl';
const PlacePageLayout = ({
  place,
  photoUrls
}: {
  place: Place;
  photoUrls: string[];
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [updatedPhotoUrls, setUpdatedPhotoUrls] = useState<string[]>(photoUrls);

  const fetchPhotos = async () => {
    if (photoUrls.length <= 1) {
      
      const urls = await uploadPlacePhotosToSupabase(place);
      setUpdatedPhotoUrls(urls);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  if (!place) return <LoadingPlace />;

  return (
    <div>
      {place.deleted && (
        <PopupPlaceDeleted
          showModal={showModal}
          setShowModal={setShowModal}
          cityId={place.city_id}
        />
      )}
      <PlaceHero place={place} photoUrl={photoUrls[0]} />
      <PlaceOverviewCard place={place} photoUrls={updatedPhotoUrls} />

      <PlaceDetails place={place} />
    </div>
  );
};

export default PlacePageLayout;
