'use server';
import { createClient } from '../supabase/server';

import convertGoogleAddress from '@/utils/places/convertGoogleAddress';
import { uploadPlacePhotos } from './uploadPlacePhotos';
import { Place } from '../types';

export const updateGooglePlaceData = async (place: Place) => {
  const supabase = createClient();
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.google_id}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.result) {
      throw new Error('No result found in the API response');
    }

    const googlePlace = data.result;

    const originalPhotoRefs = place.photo_refs;

    // Delete cafe if google place does not have dine in
    if (!googlePlace.dine_in && place.type === 'cafe') {
      const updatedPlace = {
        ...place,
        deleted: true
      };

      const { error } = await supabase
        .from('places')
        .update(updatedPlace)
        .eq('id', place.id);

      if (error) {
        throw error;
      }
      return updatedPlace;
    }

    //   console.log('Google Place Photos:', googlePlace.photos);

    const convertedAddress = convertGoogleAddress(
      googlePlace.address_components
    );

    let updatedPlace: Partial<Place> = {
      ...place,
      name: googlePlace.name ?? place.name,
      lat: googlePlace.geometry?.location?.lat ?? place.lat,
      lng: googlePlace.geometry?.location?.lng ?? place.lng,
      check_date: new Date(),
      // business_status: googlePlace.business_status ?? place.business_status,
      photo_refs: googlePlace.photos
        ? googlePlace.photos
            .slice(1, 3)
            .map((photo: { photo_reference: string }) => photo.photo_reference)
        : place.photo_refs,
      add_1: convertedAddress.add_1,
      add_2: convertedAddress.add_2,
      level: convertedAddress.level,
      district: convertedAddress.district,
      city: convertedAddress.city,
      county: convertedAddress.county,
      state: convertedAddress.state,
      postal_code: convertedAddress.postcode,
      country: convertedAddress.county,
      formatted_address:
        googlePlace.formatted_address ?? place?.formatted_address,

      dine_in: googlePlace.dine_in ?? place?.dine_in ?? null,
      wheelchair_accessible:
        googlePlace.wheelchair_accessible_entrance ??
        place?.wheelchair_accessible ??
        null,
      serves_beer: googlePlace.serves_beer ?? place.serves_beer ?? null,
      serves_breakfast:
        googlePlace.serves_breakfast ?? place.serves_breakfast ?? null,
      serves_brunch: googlePlace.serves_brunch ?? place.serves_brunch ?? null,
      serves_dinner: googlePlace.serves_dinner ?? place.serves_dinner ?? null,
      serves_lunch: googlePlace.serves_lunch ?? place.serves_lunch ?? null,
      serves_vegetarian_food:
        googlePlace.serves_vegetarian_food ??
        place.serves_vegetarian_food ??
        null,
      serves_wine: googlePlace.serves_wine ?? place.serves_wine ?? null,

      phone:
        googlePlace.formatted_phone_number ??
        googlePlace.international_phone_number ??
        place.phone ??
        null,
      website: googlePlace.website ?? place.website ?? null,
      google_maps: googlePlace.url ?? place.google_maps ?? null,
      opening_hours:
        googlePlace.opening_hours?.weekday_text ?? place?.opening_hours ?? null,
      price_level: googlePlace.price_level ?? place?.price_level ?? null,
      description:
        googlePlace.editorial_summary?.overview ?? place?.description ?? null,

      rating_score: googlePlace.rating ?? place?.rating_score ?? null,
      rating_count:
        googlePlace.user_ratings_total ?? place?.rating_count ?? null
    };

    if (
      !originalPhotoRefs ||
      originalPhotoRefs.length < 2 ||
      !updatedPlace.photo_names?.length
    ) {
      const photoNames = await uploadPlacePhotos(updatedPlace);
      const placeWithPhotoNames = {
        ...updatedPlace,
        photo_names: photoNames
      };
      updatedPlace = placeWithPhotoNames;
    }

    const { error } = await supabase
      .from('places')
      .update(updatedPlace)
      .eq('id', place.id);

    if (error) {
      throw error;
    }

    console.log('Place updated with Google Data successfully');

    return updatedPlace as Place;
  } catch (error) {
    console.error('Error updating place:', error);
    return place;
  }
};

export default updateGooglePlaceData;
