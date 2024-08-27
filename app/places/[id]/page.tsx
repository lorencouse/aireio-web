'use client';

import { StarIcon } from '@radix-ui/react-icons';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

import updateGooglePlaceData from '@/utils/places/updateGooglePlaceData';
import updateOsmPlaceData from '@/utils/places/updateOsmPlaceData';
import { Place } from '@/utils/types';

import Gallery from './_components/image-gallery';
import LoadingPlace from './_components/loading-place';
import PlaceBreadCrumb from './_components/place-breadcrumb';
import PlaceDetails from './_components/place-details';
import PlaceHero from './_components/place-hero';
import PopupPlaceDeleted from './_components/popup-place-deleted';

import { Database } from '@/types/supabase';

const PlacePage = () => {
  const params = useParams();
  const id = params.id as string;
  const [place, setPlace] = useState<Place | null>(null);
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const photoUrls = useMemo(() => {
    if (!place || !place.photos) return [];
    return place.photos.map(
      (photo) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photo.ref}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
    );
  }, [place]);

  const checkIsUpToDate = (place: Place): boolean => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (!place.check_date) {
      return false;
    }

    const checkDate = new Date(place.check_date);
    return checkDate >= thirtyDaysAgo;
  };

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        const placeData = data as Place;
        setPlace(placeData);
        console.log(placeData);
        if (!checkIsUpToDate(placeData)) {
          setIsLoading(true);
          const updatedPlace = await updateGooglePlaceData(placeData);
          if (updatedPlace === null) {
            setShowModal(true);
            return;
          }
          if (JSON.stringify(updatedPlace) !== JSON.stringify(placeData)) {
            setPlace(updatedPlace);
          }
          const updatedOSM = await updateOsmPlaceData(updatedPlace);
          if (JSON.stringify(updatedOSM) !== JSON.stringify(updatedPlace)) {
            setPlace(updatedOSM);
          }
        }
      } catch (error) {
        console.error('Error fetching place:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlace();
  }, [id, supabase]);

  const handleCloseModal = () => {
    setShowModal(false);
    router.push(`/places?city_id=${place.address.city_id}`);
  };

  if (!place || isLoading) return <LoadingPlace />;

  return (
    <div className='container mx-auto p-4'>
      <PopupPlaceDeleted
        showModal={showModal}
        setShowModal={setShowModal}
        handleCloseModal={handleCloseModal}
      />

      <PlaceHero place={place} photoUrl={photoUrls[0]} />
      <Card className='mb-8'>
        <CardContent className='flex flex-col md:flex-row p-6'>
          <div className='w-full md:w-1/4 flex justify-center items-center mb-4 md:mb-0'>
            {photoUrls.length > 0 ? (
              <Gallery photos={photoUrls} />
            ) : (
              <Avatar className='w-24 h-24'>
                <AvatarFallback>{place.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className='w-full md:w-3/4 md:pl-6'>
            {place && <PlaceBreadCrumb place={place} />}

            {place.google_rating && (
              <div className='flex items-center mb-2'>
                <StarIcon className='w-4 h-4 mr-1' />
                <span>
                  {place.google_rating.score} ({place.google_rating.count})
                </span>
              </div>
            )}

            {place.type === 'cafe' && (
              <p className='mb-2'>
                Price Level:{' '}
                {place.tags.cost ? '$'.repeat(place.tags.cost) : '?'}
              </p>
            )}

            <p className='mb-2'>
              Type: <span className='capitalize'>{place.type}</span>
            </p>
            <div>
              <h3 className='font-bold mt-4 mb-2'>Amenities:</h3>
              <p>
                Outdoor Seating:{' '}
                {place.amenities.outdoor_seating || 'Not specified'}
              </p>
              <p>
                Power Outlets:{' '}
                {place.amenities.power_outlets || 'Not specified'}
              </p>
              <p>
                Wheelchair Accessible:{' '}
                {place.amenities.wheelchair_accessible || 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PlaceDetails place={place} />
    </div>
  );
};

export default PlacePage;
