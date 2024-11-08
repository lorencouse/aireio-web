import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { Place } from '@/utils/types';
import Amenity from './amenity';
import SocialLinks from './social-links';
import Icon from './icon-map';
import { AmenityAggregation } from '@/utils/types';

const PlaceDetails = ({
  place,
  userSubmissions
}: {
  place: Place;
  userSubmissions: AmenityAggregation[];
}) => {
  const handlePress = (url: string) => {
    window.open(url, '_blank');
  };

  const websiteName = place?.website
    ? new URL(place.website).hostname.replace('www.', '')
    : '';
  const isCafeOrRestaurant =
    place.type === 'cafe' || place.type === 'restaurant';

  return (
    <Card className="bg-background text-foreground">
      <CardContent className="pt-6 text-lg flex flex-row flex-wrap justify-between gap-8">
        <div className="contact-info">
          <div className="mb-8">
            {(place.note && place.note.length > 0) ||
              (place.description && place.description.length > 0 && (
                <>
                  <h3 className=" font-extrabold mb-4 text-2xl">
                    {place.name} Overview
                  </h3>
                  <p>{place.description}</p>
                  <p>{place.note}</p>
                </>
              ))}
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Icon
              name={place.type === 'cafe' ? 'coffee' : 'library'}
              className="w-5 h-5"
            />
            <span className="capitalize">{place.type}</span>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Icon name="map-pin" className="w-5 h-5" />
            <div>
              <span
                className="hover:underline cursor-pointer"
                onClick={() =>
                  handlePress(
                    place.google_maps ||
                      `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
                  )
                }
              >
                <p>{place?.formatted_address}</p>
              </span>
            </div>
          </div>

          {place?.phone && (
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="phone" className="w-5 h-5" />
              <span
                onClick={() => handlePress(`tel:${place.phone}`)}
                className="hover:underline cursor-pointer"
              >
                {place.phone}
              </span>
            </div>
          )}

          {place?.website && (
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="globe" className="w-5 h-5" />
              <span
                onClick={() => handlePress(place.website ? place.website : '')}
                className="hover:underline cursor-pointer"
              >
                {websiteName}
              </span>
            </div>
          )}

          <div className="flex space-x-2 mb-4">
            <Icon name="clock" className="w-5 h-5" />
            <div>
              {place?.opening_hours ? (
                <ul>
                  {place.opening_hours.map((day) => (
                    <li key={day}>{day}</li>
                  ))}
                </ul>
              ) : (
                <span>?</span>
              )}
            </div>
          </div>
        </div>
        <div
          className={`amenities flex flex-col mt-4 ${isCafeOrRestaurant ? 'justify-between' : 'justify-end'} content-end`}
        >
          {isCafeOrRestaurant && (
            <>
              <p className="mb-6 text-2xl underline">This Location Serves</p>
              <Amenity
                name="Serves Vegetarian Food"
                value={place.serves_vegetarian_food}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_vegetarian_food'
                )}
              />
              <Amenity
                name="Serves Vegan Food"
                value={place.serves_vegan_food}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_vegan_food'
                )}
              />
              <Amenity
                name="Serves Beer"
                value={place.serves_beer}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_beer'
                )}
              />
              <Amenity
                name="Serves Wine"
                value={place.serves_wine}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_wine'
                )}
              />
              <Amenity
                name="Serves Breakfast"
                value={place.serves_breakfast}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_breakfast'
                )}
              />
              <Amenity
                name="Serves Brunch"
                value={place.serves_brunch}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_brunch'
                )}
              />
              <Amenity
                name="Serves Lunch"
                value={place.serves_lunch}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_lunch'
                )}
              />
              <Amenity
                name="Serves Dinner"
                value={place.serves_dinner}
                placeId={place.id}
                aggregation={userSubmissions.find(
                  (sub) => sub.amenity_name === 'serves_dinner'
                )}
              />
            </>
          )}
          <SocialLinks place={place} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceDetails;
