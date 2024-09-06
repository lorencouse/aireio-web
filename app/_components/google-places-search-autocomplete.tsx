'use client';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import useGetCity from '@/utils/hook/useGetCity';

const libraries: 'places'[] = ['places'];

const GooglePlacesAutocomplete = () => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { onPlaceSelected } = useGetCity();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string,
    libraries
  });

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    }
  };

  const autocompleteOptions: google.maps.places.AutocompleteOptions = {
    types: ['(cities)']
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={autocompleteOptions}
    >
      <Input type="text" placeholder="Search for a city ..." className="w-72" />
    </Autocomplete>
  );
};

export default GooglePlacesAutocomplete;
