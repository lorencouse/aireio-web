import React from 'react';
import { Place } from '@/utils/types';
import { Card, CardContent } from '@/components/ui/card';
import Gallery from './image-gallery';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import PlaceBreadCrumb from './place-breadcrumb';
import { StarIcon } from '@radix-ui/react-icons';

const PlaceOverviewCard = ({
  place,
  photoUrls
}: {
  place: Place;
  photoUrls: string[];
}) => {
  return (
    <div>
      <Card className="mb-8">
        <CardContent className="flex flex-col md:flex-row p-6">
          <div className="w-full md:w-1/4 flex justify-center items-center mb-4 md:mb-0">
            {photoUrls.length > 0 ? (
              <Gallery photos={photoUrls} />
            ) : (
              <Avatar className="w-24 h-24">
                <AvatarFallback>{place.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="w-full md:w-3/4 md:pl-6">
            {place && <PlaceBreadCrumb place={place} />}

            {place.rating_score && (
              <div className="flex items-center mb-2">
                <StarIcon className="w-4 h-4 mr-1" />
                <span>
                  {place.rating_score} ({place.rating_count})
                </span>
              </div>
            )}

            {place.type === 'cafe' && (
              <p className="mb-2">
                Price Level:{' '}
                {place.price_level ? '$'.repeat(place.price_level) : '?'}
              </p>
            )}

            <p className="mb-2">
              Type: <span className="capitalize">{place.type}</span>
            </p>
            <div>
              <h3 className="font-bold mt-4 mb-2">Amenities:</h3>
              <p>
                Outdoor Seating:{' '}
                {place.outdoor_seating || 'Not specified'}
              </p>
              <p>
                Power Outlets:{' '}
                {place.power_outlets || 'Not specified'}
              </p>
              <p>
                Wheelchair Accessible:{' '}
                {place.wheelchair_accessible || 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceOverviewCard;
