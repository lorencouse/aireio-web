import React from 'react';
import { AmenityAggregation, Place, PlaceLike } from '@/utils/types';
import { Card, CardContent } from '@/components/ui/card';
import Gallery from './image-gallery';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Amenity from './amenity';
import PriceLevel from '../../_components/price-level';
import FavoriteToggle from './favorite-toggle';
import WifiDetails from './wifi-details';
import ThumbsUpDown from './thumbs-up-down';

const PlaceOverviewCard = ({
  place,
  photoUrls,
  userSubmissions,
  likes
}: {
  place: Place;
  photoUrls: string[];
  userSubmissions: AmenityAggregation[];
  likes: PlaceLike[];
}) => {
  return (
    <Card className="mb-8 rounded-t-none rounded-b-2xl bg-background text-foreground drop-shadow-lg">
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
          <div className="flex flex-row items-center gap-4 justify-between">
            <FavoriteToggle placeId={place.id} />
            <ThumbsUpDown placeId={place.id} likes={likes} />
          </div>
          {place.rating_score && (
            <div className="flex items-center my-2 ">
              <span className="font-bold text-xl mr-1">✭</span>
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
            <Amenity
              name={'Indoor Seating'}
              value={place.indoor_seating}
              placeId={place.id}
              aggregation={userSubmissions.find(
                (sub) => sub.amenity_name === 'indoor_seating'
              )}
            />
            <Amenity
              name={'Outdoor Seating'}
              value={place.outdoor_seating}
              placeId={place.id}
              aggregation={userSubmissions.find(
                (sub) => sub.amenity_name === 'outdoor_seating'
              )}
            />
            <Amenity
              name={'Wheelchair Accessible'}
              value={place.wheelchair_accessible}
              placeId={place.id}
              aggregation={userSubmissions.find(
                (sub) => sub.amenity_name === 'wheelchair_accessible'
              )}
            />
            <Amenity
              name={'Power Outlets'}
              value={place.power_outlets}
              placeId={place.id}
              aggregation={userSubmissions.find(
                (sub) => sub.amenity_name === 'power_outlets'
              )}
            />

            <Amenity
              name={'Internet Access'}
              value={place.internet_access}
              placeId={place.id}
              aggregation={userSubmissions.find(
                (sub) => sub.amenity_name === 'internet_access'
              )}
            />
            {(place.internet_access === true ||
              userSubmissions.some(
                (sub) => sub.amenity_name === 'internet_access'
              )) && (
              <WifiDetails
                placeId={place.id}
                wifiNetwork={userSubmissions.find(
                  (sub) => sub.amenity_name === 'wifi_network'
                )}
                wifiPassword={userSubmissions.find(
                  (sub) => sub.amenity_name === 'wifi_password'
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceOverviewCard;
