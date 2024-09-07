// app/utils/places/placesUtils.ts

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { City, GooglePlace, Place } from '@/utils/types';

import { Database } from '@/types/supabase';

import useSupabase from '../hook/useSupabase';
import uploadImageToSupabase from '../functions/places/uploadImageToSupabase';
import axios from 'axios';

const supabase = useSupabase();

// export const fetchCity = async (cityId: string): Promise<City> => {
//   const { data, error } = await supabase
//     .from('cities')
//     .select('*')
//     .eq('id', cityId)
//     .single();

//   if (error) throw error;
//   return data as City;
// };

export const createAndReturnGooglePlaces = async (
  city: City,
  type: 'cafe' | 'library' | 'coworking',
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
  type: 'cafe' | 'library' | 'coworking',
  places: GooglePlace[]
): Promise<Place[]> => {
  try {
    if (!city || !type || !places) {
      throw new Error('Missing required parameters for createNewPlaces');
    }

    const newPlaces: Place[] = places.map(
      (place: GooglePlace): Omit<Place, 'id'> => ({
        name: place.name,
        city_id: city.id,
        google_id: place.place_id,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        type,
        business_status: place.business_status,
        add_1: place.formatted_address || place.vicinity,
        city: city.name,
        state: city.state,
        country: city.country,
        country_code: city.country_code,
        rating_score: place.rating,
        rating_count: place.user_ratings_total,
        price_level: place.price_level,
        photo_refs: place.photos ? [place.photos[0].photo_reference] : []
      })
    );

    console.log(`Inserting ${newPlaces.length} new places`);
    const { data: insertedPlaces, error } = await supabase
      .from('places')
      .upsert(newPlaces, { onConflict: 'google_id' })
      .select();

    if (error) throw error;
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

export const uploadPlacePhotosToSupabase = async (place: Place) => {
  const photos = place.photo_refs;
  if (!photos || !photos.length) {
    console.log('No photos found for place', place.name);
    return;
  }
  const type = place.type;

  // Determine if we're in a browser or server environment
  const isServer = typeof window === 'undefined';

  // Get the base URL for the API
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' // Replace with your actual API URL
    : '';

  const uploadPromises = photos.map(async (photo, index) => {
    const imageName = `${place.country_code}_${place.state}_${place.city}_${place.name}_${index}.jpg`;
    const formattedImageName = encodeURIComponent(
      imageName.replace(/[^a-zA-Z0-9_.-]/g, '_')
    );

    const apiPath = '/api/cities/place-photo';
    const params = new URLSearchParams({
      photoReference: photo,
      maxWidth: '500',
      type,
      imageName: formattedImageName,
      placeId: place.id
    });

    const fullUrl = `${baseUrl}${apiPath}?${params.toString()}`;

    try {
      const response = await axios.post(fullUrl);
      console.log('Photo upload successful:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message, error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  });

  try {
    await Promise.all(uploadPromises);
    console.log('All photos uploaded successfully');
  } catch (error) {
    console.error('Error uploading one or more photos:', error);
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
