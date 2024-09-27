'use server';

import { createClient } from '@/utils/supabase/server';
import { uploadPlacePhotos } from '@/utils/places/uploadPlacePhotos';
import { City, Place, GooglePlace } from '@/utils/types';

export async function getCity(cityName: string) {
  const supabase = createClient();
  const { data: city, error } = await supabase
    .from('cities')
    .select('*')
    .eq('name', cityName)
    .single();

  if (error) {
    console.error('Error fetching city:', error);
    throw error;
  }

  if (!city) {
    throw new Error('City not found');
  }

  return city;
}

export async function getPlaces(city: City) {
  let places: Place[] = [];

  try {
    places = await fetchExistingPlaces(city.id);

    if (places.length === 0) {
      places = await fetchNewPlaces(
        city,
        'cafe',
        '1000',
        city.lat.toString(),
        city.lng.toString()
      );
    }
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }

  return places;
}

export const fetchExistingPlaces = async (cityId: string): Promise<Place[]> => {
  const supabase = createClient();
  const { data, error, count } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', cityId);

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

export const fetchNewPlaces = async (
  city: City,
  type: string,
  radius: string,
  lat: string,
  lng: string
) => {
  const params = new URLSearchParams({
    type,
    lat,
    lng,
    radius
  });
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  // console.log('Fetching places with params:', params.toString());

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&${
      type === 'coworking' ? 'keyword' : 'type'
    }=${type}&key=${API_KEY}`;
    const res = await fetch(url);
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
    const supabase = createClient();

    const newPlaces: Partial<Place>[] = places.map((place) => ({
      name: place.name,
      city_id: city.id,
      google_id: place.place_id,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      type,
      add_1: place.vicinity,
      city: city.name,
      state: city.state,
      country: city.country,
      country_code: city.country_code,
      rating_score: place.rating,
      rating_count: place.user_ratings_total,
      price_level: place.price_level,
      photo_refs: place.photos ? [place.photos[0].photo_reference] : [],
      photo_names: [] // Initialize with an empty array
    }));

    // console.log(`Inserting ${newPlaces.length} new places`);
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

    // Use Promise.all to handle all uploadPlacePhotos operations concurrently
    const insertedPlacesWithPhotos = await Promise.all(
      insertedPlaces.map(async (place) => {
        const updatedPhotoNames = await uploadPlacePhotos(place);

        const updatedPlace = {
          ...place,
          photo_names: [...place.photo_names, ...updatedPhotoNames]
        };

        return updatedPlace || place; // Return the updated place or the original if update returns null
      })
    );

    return insertedPlacesWithPhotos;
  } catch (error) {
    console.error('Error in createNewPlaces:', error);
    throw error;
  }
};
