// app/utils/places/placesUtils.ts

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { City, GooglePlace, Place } from '@/utils/types';

import { Database } from '@/types/supabase';

import useSupabase from '../hook/useSupabase';
import uploadImageToSupabase from '../functions/places/uploadImageToSupabase';
import axios from 'axios';

const supabase = useSupabase();

export const createAndReturnGooglePlaces = async (
  city: City,
  type: string,
  radius: string,
  lat: string,
  lng: string
): Promise<GooglePlace[]> => {
  const params = new URLSearchParams({
    type,
    lat,
    lng,
    radius
  });

  console.log('Fetching places with params:', params.toString());

  try {
    const res = await fetch(`/api/places/google-places-nearby?${params}`);
    if (!res.ok) {
      throw new Error(
        `Network response was not ok: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log('Received data:', data);

    if (!data.results || !Array.isArray(data.results)) {
      console.log('No results found or invalid response format');
      return [];
    }

    const operationalPlaces = data.results.filter(
      (place: GooglePlace) =>
        place.business_status === 'OPERATIONAL' &&
        typeof place.user_ratings_total === 'number' &&
        place.user_ratings_total >= 5 &&
        typeof place.rating === 'number' &&
        place.rating >= 2.5
    );

    if (!operationalPlaces.length) {
      console.log('No new places found');
      return [];
    }
    const newPlaces = await createNewPlaces(city, type, operationalPlaces);
    console.log(`Found ${newPlaces.length} new places`);
    return newPlaces;
  } catch (error) {
    console.error('Error fetching places from Google:', error);
    throw error;
  }
};

export const createNewPlaces = async (
  city: City,
  type: string,
  places: GooglePlace[]
): Promise<Place[]> => {
  try {
    if (!city || !type || !places) {
      throw new Error('Missing required parameters for createNewPlaces');
    }

    const newPlaces: Omit<Place, 'id'>[] = places.map((place: GooglePlace) => ({
      name: place.name,
      city_id: city.id,
      google_id: place.place_id,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      type,
      add_1: place.formatted_address || place.vicinity,
      city: city.name,
      state: city.state,
      country: city.country,
      country_code: city.country_code,
      rating_score: place.rating,
      rating_count: place.user_ratings_total,
      price_level: place.price_level,
      photo_refs: place.photos ? [place.photos[0].photo_reference] : []
    }));

    console.log(`Inserting ${newPlaces.length} new places`);
    const { data: insertedPlaces, error } = await supabase
      .from('places')
      .upsert(newPlaces, {
        onConflict: 'google_id',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('Error in upsert operation:', error);
      throw error;
    }

    if (!insertedPlaces || insertedPlaces.length === 0) {
      console.log('No new places inserted');
      return [];
    }

    insertedPlaces.forEach((place) => {
      uploadPlacePhotosToSupabase(place);
    });

    return insertedPlaces;
  } catch (error) {
    console.error('Error in createNewPlaces:', error);
    throw error;
  }
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const uploadPlacePhotosToSupabase = async (
  place: Place
): Promise<string[]> => {
  const photoRefs = place.photo_refs;
  if (!photoRefs || !photoRefs.length) {
    console.log('No photos found for place', place.name);
    return [];
  }

  const uploadPromises = photoRefs.map(async (photoRef, index) => {
    let imageName;
    if (photoRefs.length === 1) {
      imageName = `${place.name}_${place.city}_${place.state}_${place.country_code}.jpg`;
    } else {
      imageName = `${place.name}_${place.city}_${place.state}_${place.country_code}_${index + 1}.jpg`;
    }
    const formattedImageName = imageName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const apiPath = `/api/cities/place-photo?maxWidth=500&cityId=${place.city_id}&imageName=${formattedImageName}&placeId=${place.id}&photoRef=${photoRef}`;

    try {
      const response = await axios.post(apiPath);
      console.log('Photo upload successful:', response.data);

      // Construct the URL manually
      const url = new URL(
        `${SUPABASE_URL}/storage/v1/object/public/images/places/${place.city_id}/${place.id}/${formattedImageName}`
      );

      // Add cache-control header to the URL
      url.searchParams.append(
        'cache-control',
        'public, max-age=31536000, immutable'
      );

      return url.toString();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message, error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(
      (url): url is string => url !== null
    );
    console.log('All photos uploaded successfully');
    console.log('Constructed URLs:', successfulUploads);
    return successfulUploads;
  } catch (error) {
    console.error('Error uploading one or more photos:', error);
    return [];
  }
};

export const fetchPlacesFromDatabase = async (city: City): Promise<Place[]> => {
  const { data, error, count } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', city.id);

  if (error) {
    console.error('Error fetching places:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log('No places found');
    return [];
  }

  return data as Place[];
};
