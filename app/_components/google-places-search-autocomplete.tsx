'use client';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { City } from '@/utils/types';
import { fetchCity } from './actions';

const libraries: 'places'[] = ['places'];

const GooglePlacesAutocomplete: React.FC = () => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string,
    libraries
  });

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = async () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.address_components) {
        try {
          const city: City = {
            google_id: place.place_id || '',
            osm_id: '',
            name: place.address_components[0].long_name
              .replace(/\s/g, '-')
              .replace(/[^a-zA-Z0-9-]/g, ''),
            lat: place.geometry.location?.lat() || 0,
            lng: place.geometry.location?.lng() || 0,
            state:
              place.address_components[
                place.address_components.length - 2
              ]?.long_name.replace(/\s/g, '-') || '',
            state_code:
              place.address_components[place.address_components.length - 2]
                ?.short_name || '',
            country:
              place.address_components[place.address_components.length - 1]
                ?.long_name || '',
            country_code:
              place.address_components[place.address_components.length - 1]
                ?.short_name || '',
            photo_ref: ''
          };

          // Invoke the server-side function from the client
          await fetchCity(city);
        } catch (error) {
          console.error('Error fetching city:', error);
          setError(
            'An error occurred while fetching the city. Please try again.'
          );
        }
      } else {
        setError('No place details found. Please try a different city.');
      }
    }
  };

  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    types: ['(cities)']
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={autocompleteOptions}
      >
        <Input type="text" placeholder="Enter a city" />
      </Autocomplete>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default GooglePlacesAutocomplete;
