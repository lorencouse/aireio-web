'use server';

import { createClient } from '@/utils/supabase/server';
import { uploadPlacePhotos } from '@/utils/places/uploadPlacePhotos';
import { City, Place, GooglePlace } from '@/utils/types';
import { Database } from '@/types_db';

export async function getCity(params: any): Promise<City> {
  const supabase = createClient();
  const { country, state, city: name } = params;
  const { data: city, error } = await supabase
    .from('cities')
    .select('*')
    .eq('name', name)
    .eq('country_code', country)
    .eq('state', state)
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

export async function getPlaces(city: City, params: any) {
  let places: Place[] = [];
  const { place_type, radius, lat, lng } = params;

  try {
    places = await fetchExistingPlaces(city.id);

    if (places.length === 0) {
      places = await fetchNewPlaces(
        city,
        place_type || 'cafe',
        radius || '1000',
        lat || city.lat.toString(),
        lng || city.lng.toString()
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
): Promise<Place[]> => {
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

    type PlaceInsert = Database['public']['Tables']['places']['Insert'];

    const newPlaces: PlaceInsert[] = places.map((place) => ({
      name: place.name,
      city_id: city.id,
      google_id: place.place_id,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      type: type,
      add_1: place.vicinity || null,
      city: city.name,
      state: city.state || null,
      country: city.country || null,
      country_code: city.country_code || null,
      rating_score: place.rating || null,
      rating_count: place.user_ratings_total || null,
      price_level: place.price_level || null,
      photo_refs: place.photos ? [place.photos[0].photo_reference] : null,
      deleted: false
      // Only include fields you have data for
    }));

    // Then use this in your insert operation
    const { data: insertedPlaces, error } = await supabase
      .from('places')
      .insert(newPlaces)
      .select();

    if (error) {
      console.error('Error in insert operation:', error);
      throw error;
    }

    if (!insertedPlaces || insertedPlaces.length === 0) {
      console.log('No new places inserted');
      return [];
    }

    const insertedPlacesWithPhotos = await Promise.all(
      insertedPlaces.map(async (place) => {
        const updatedPhotoNames = await uploadPlacePhotos(place);

        const updatedPlace = {
          ...place,
          photo_names: [
            ...(Array.isArray(place.photo_names) ? place.photo_names : []),
            ...updatedPhotoNames
          ]
        };

        return updatedPlace;
      })
    );

    // Type assertion to convert null to undefined for relevant properties
    return insertedPlacesWithPhotos.map((place) => {
      const placeWithUndefined: Place = Object.fromEntries(
        Object.entries(place).map(([key, value]) => [
          key,
          value === null ? undefined : value
        ])
      ) as Place;
      return placeWithUndefined;
    });
  } catch (error) {
    console.error('Error in createNewPlaces:', error);
    throw error;
  }
};
