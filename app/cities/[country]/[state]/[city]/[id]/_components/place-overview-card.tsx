import React from 'react';
import { Place } from '@/utils/types';
import { Card, CardContent } from '@/components/ui/card';
import Gallery from './image-gallery';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// import { StarIcon } from '@radix-ui/react-icons';
import Amenity from './amenity';
import PriceLevel from '../../_components/price-level';
const PlaceOverviewCard = ({
  place,
  photoUrls
}: {
  place: Place;
  photoUrls: string[];
}) => {
  return (
    <div>
      <Card className="my-8 bg-background text-foreground">
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
            {place.rating_score && (
              <div className="flex items-center mb-2">
                <span>✭</span>
                <span>
                  {place.rating_score} ({place.rating_count})
                </span>
              </div>
            )}

            {place.type === 'cafe' && (
              <div className="mb-2 gap-2 flex flex-row">
                <span className="font-bold">Price Level: </span>
                {place.price_level ? (
                  <PriceLevel
                    priceLevel={place.price_level}
                    primaryColor="text-foreground"
                    secondaryColor="text-gray-300"
                  />
                ) : (
                  '?'
                )}
              </div>
            )}
            <div>
              {/* <h3 className="font-bold mt-4 mb-2">Amenities:</h3> */}
              <Amenity
                name={'Indoor Seating'}
                value={place.indoor_seating}
                placeId={place.id}
              />
              <Amenity
                name={'Outdoor Seating'}
                value={place.outdoor_seating}
                placeId={place.id}
              />
              <Amenity
                name={'Wheelchair Accessible'}
                value={place.wheelchair_accessible}
                placeId={place.id}
              />
              <Amenity
                name={'Power Outlets'}
                value={place.power_outlets}
                placeId={place.id}
              />

              <Amenity
                name={'Wifi'}
                value={place.internet_access}
                placeId={place.id}
              />
              {/* {place.internet_access === true && place.internet_password && (
                <Amenity
                  name={'Wifi Password'}
                  value={place.internet_password}
                  placeId={place.id}
                />
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceOverviewCard;
