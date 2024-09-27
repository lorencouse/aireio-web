import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { Place } from '@/utils/types';
import Amenity from './amenity';
import { EmojiAmenity } from './emoji-amenity';
import SocialLinks from './social-links';

// Custom Icon component
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons = {
    coffee: (
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
    ),
    library: (
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20" />
    ),
    'map-pin': (
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    globe: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-5-8a5 5 0 0 0 10 0 5 5 0 0 0-10 0z" />
    ),
    clock: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-8.59V7a1 1 0 0 0-2 0v5a1 1 0 0 0 .5.87l4 2.5a1 1 0 1 0 1-1.74l-3.5-2.18z" />
    )
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name as keyof typeof icons]}
    </svg>
  );
};

const PlaceDetails = ({ place }: { place: Place }) => {
  const handlePress = (url: string) => {
    window.open(url, '_blank');
  };

  const websiteName = place?.website
    ? new URL(place.website).hostname.replace('www.', '')
    : '';

  return (
    <Card>
      <CardContent className="pt-6 text-lg flex flex-row justify-between">
        <div className="contact-info">
          <div className="mb-8">
            {(place.notes && place.notes.length > 0) ||
              (place.description && place.description.length > 0 && (
                <>
                  <h3 className="underline font-extrabold mb-4">
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
                variant="link"
                onClick={() =>
                  handlePress(
                    place.google_maps ||
                      `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`
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
                variant="link"
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
                variant="link"
                onClick={() => handlePress(place.website)}
                className="hover:underline cursor-pointer"
              >
                {websiteName}
              </span>
            </div>
          )}

          <div className="flex space-x-2 mb-4">
            <Icon name="clock" className="w-5 h-5" />
            {/* <p>{formattedOpeningHours}</p> */}
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

          <SocialLinks place={place} />
        </div>
        <div className="amenities flex flex-col mx-6 mt-4">
          {(place.type === 'cafe' || place.type === 'restaurant') && (
            <>
              <p className="mb-6 text-2xl underline">This Location Serves</p>
              <Amenity
                name="Serves Vegetarian Food"
                value={place.serves_vegetarian_food}
                placeId={place.id}
              />
              <Amenity
                name="Serves Vegan Food"
                value={place.serves_vegan_food}
                placeId={place.id}
              />
              <Amenity
                name="Serves Beer"
                value={place.serves_beer}
                placeId={place.id}
              />
              <Amenity
                name="Serves Wine"
                value={place.serves_wine}
                placeId={place.id}
              />
              <Amenity
                name="Serves Breakfast"
                value={place.serves_breakfast}
                placeId={place.id}
              />
              <Amenity
                name="Serves Brunch"
                value={place.serves_brunch}
                placeId={place.id}
              />
              <Amenity
                name="Serves Lunch"
                value={place.serves_lunch}
                placeId={place.id}
              />
              <Amenity
                name="Serves Dinner"
                value={place.serves_dinner}
                placeId={place.id}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceDetails;
