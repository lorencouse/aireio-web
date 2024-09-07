import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { Place } from '@/utils/types';

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

  const formattedOpeningHours = place?.opening_hours
    ? place.opening_hours.replace(/; /g, '\n')
    : '?';

  return (
    <Card>
      <CardContent className="pt-6 text-lg ">
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

        <div className="flex items-center space-x-2 mb-4">
          <Icon name="clock" className="w-5 h-5" />
          <p>{formattedOpeningHours}</p>
        </div>

        <div className="flex justify-between mt-4">
          <span title="Internet Access">
            🛜:{' '}
            {place?.internet_access === 'yes' ||
            place?.internet_access === 'wlan'
              ? '✅'
              : place?.internet_access === 'no'
                ? '🚫'
                : '🤔'}
          </span>
          <span title="Seating">
            🪑:{' '}
            {place?.outdoor_seating === 'yes'
              ? '✅ Outdoor'
              : place?.indoor_seating === 'yes'
                ? '✅ Indoor'
                : place?.outdoor_seating || place?.indoor_seating
                  ? '🚫'
                  : '🤔'}
          </span>
          <span title="Wheelchair Accessible">
            ♿️:{' '}
            {place?.wheelchair_accessible === 'yes'
              ? '✅'
              : place?.wheelchair_accessible === 'limited'
                ? '⚠️'
                : place?.wheelchair_accessible === 'no'
                  ? '🚫'
                  : '🤔'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceDetails;
