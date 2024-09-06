import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Place } from '@/utils/types';
import { Database } from '@/types/supabase';
import updateGooglePlaceData from '@/utils/places/updateGooglePlaceData';
import updateOsmPlaceData from '@/utils/places/updateOsmPlaceData';
import PlacePageLayout from './place-page-layout';
import { Suspense } from 'react';
import LoadingPlace from './_components/loading-place';
import getSupabasePlacePhotoUrl from '@/utils/functions/places/getSupabasePlacePhotoIrl';

const checkIsUpToDate = (place: Place): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (!place.check_date) {
    return false;
  }
  const checkDate = new Date(place.check_date);
  return checkDate >= thirtyDaysAgo;
};

export default async function PlacePage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: place, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching place:', error);
    return (
      <div>
        Error loading place{' '}
        <span
          className="text-blue-500 underline cursor-pointer hover:text-blue-800"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </span>
      </div>
    );
  }

  let updatedPlace = place as Place;

  if (!checkIsUpToDate(updatedPlace)) {
    updatedPlace = (await updateGooglePlaceData(updatedPlace)) || updatedPlace;
    updatedPlace = await updateOsmPlaceData(updatedPlace);
  }

  const photoUrls = [
    getSupabasePlacePhotoUrl(updatedPlace.type, updatedPlace.photos[0].ref)
  ];

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<LoadingPlace />}>
        <PlacePageLayout place={updatedPlace} photoUrls={photoUrls} />
      </Suspense>
    </div>
  );
}
