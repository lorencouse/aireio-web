// app/utils/places/placesUtils.ts

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { City, GooglePlace, Place } from '@/utils/types';

import { Database } from '@/types/supabase';

import useSupabase from '../hook/useSupabase';

const supabase = useSupabase();

export const fetchCity = async (cityId: string): Promise<City> => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', cityId)
    .single();

  if (error) throw error;
  return data as City;
};

export const fetchPlacesFromGoogle = async (
  city: City,
  type: 'cafe' | 'library' | 'coworking',
  radius: string,
  lat: string,
  lng: string
): Promise<GooglePlace[]> => {
  const allPlaces: GooglePlace[] = [];
  let pageToken: string | null = null;

  do {
    const params = new URLSearchParams({
      type,
      lat,
      lng,
      radius,
      ...(pageToken && { pagetoken: pageToken })
    });
    console.log('Fetching places with params:', params.toString());
    const res = await fetch(`/api/places/google-places-nearby?${params}`);

    if (!res.ok)
      throw new Error(
        `Network response was not ok: ${res.status} ${res.statusText}`
      );

    const data = await res.json();
    console.log('Received data:', data);

    if (!data.results?.length) {
      console.log('No results found in this page');
      break;
    }

    const newPlaces = data.results.filter(
      (place: GooglePlace) =>
        !city.google_place_ids.includes(place.place_id) &&
        !city.blacklist_google_ids.includes(place.place_id)
    );

    allPlaces.push(...newPlaces);
    pageToken = data.next_page_token || null;

    if (pageToken) {
      console.log('Waiting before fetching next page...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } while (pageToken);

  return allPlaces;
};

export const createNewPlaces = async (
  city: City,
  type: 'cafe' | 'library' | 'coworking',
  googlePlaces: GooglePlace[]
): Promise<Place[]> => {
  try {
    if (!city || !type || !googlePlaces) {
      throw new Error('Missing required parameters for createNewPlaces');
    }

    const filteredPlaces = googlePlaces.filter(
      (place: GooglePlace) =>
        place.business_status === 'OPERATIONAL' &&
        typeof place.user_ratings_total === 'number' &&
        place.user_ratings_total >= 5 &&
        typeof place.rating === 'number' &&
        place.rating >= 2.5
    );

    if (!filteredPlaces.length) {
      console.log('No new places found');
      return [];
    }

    const newPlaces: Place[] = filteredPlaces.map(
      (place: GooglePlace): Omit<Place, 'id'> => ({
        google_place_id: place.place_id,
        name: place.name,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        type,
        business_status: place.business_status,
        address: {
          add_1: place.formatted_address || place.vicinity,
          city: city.name,
          city_id: city.id,
          state: city.state,
          country: city.country
        },
        contact: {},
        amenities: {},
        google_rating: {
          score: place.rating,
          count: place.user_ratings_total
        },
        tags: { cost: place.price_level },
        photos: place.photos ? [{ ref: place.photos[0].photo_reference }] : []
      })
    );

    console.log(`Inserting ${newPlaces.length} new places`);
    const { data: insertedPlaces, error } = await supabase
      .from('places')
      .upsert(newPlaces, { onConflict: 'google_place_id' })
      .select();

    if (error) throw error;
    if (!insertedPlaces || insertedPlaces.length === 0)
      throw new Error('No places were inserted');

    console.log(`Updating city with ${insertedPlaces.length} places`);
    const typeIds = `${type}_ids` as keyof City;
    const { data: updatedCity, error: updateError } = await supabase
      .from('cities')
      .update({
        [typeIds]: [
          ...(city[typeIds] || []),
          ...insertedPlaces.map((place) => place.id)
        ],
        google_place_ids: [
          ...(city.google_place_ids || []),
          ...insertedPlaces.map((place) => place.google_place_id)
        ]
      })
      .eq('id', city.id)
      .select();

    if (updateError) throw updateError;

    return insertedPlaces;
  } catch (error) {
    console.error('Error in createNewPlaces:', error);
    throw error;
  }
};

export const fetchPlacesFromDatabase = async (
  city: City,
  type: 'cafe' | 'library' | 'coworking'
): Promise<Place[]> => {
  const { data, error, count } = await supabase
    .from('places')
    .select('*', { count: 'exact' })
    .in('id', city[`${type}_ids`] || [])
    .order('name')
    .limit(200);

  if (error) {
    console.error('Error fetching places:', error);
    throw error;
  }

  return data as Place[];
};
