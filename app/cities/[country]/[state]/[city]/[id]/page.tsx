import PlacePageLayout from './place-page-layout';
import { Suspense } from 'react';
import LoadingPlace from './_components/loading-place';
import { getPlaceData } from './actions';

export default async function PlacePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const placeId = (await params).id;

  if (!placeId) {
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

  const { place, userSubmissions, likes } = await getPlaceData(placeId);

  return (
    <div className="place-page">
      <Suspense fallback={<LoadingPlace />}>
        <PlacePageLayout
          place={place}
          userSubmissions={userSubmissions || []}
          likes={likes}
        />
      </Suspense>
    </div>
  );
}
