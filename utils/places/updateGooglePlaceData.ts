// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { createClient } from '../supabase/server';

import convertGoogleAddress from '@/utils/places/convertGoogleAddress';
import { uploadPlacePhotosToSupabase } from './placesUtils';

export const updateGooglePlaceData = async (place: Place) => {
  const supabase = createClient();
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.google_id}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );
    if (!res.status === 200) {
      throw new Error('Network response was not ok');
    }
    const data = await res.data;
    const googlePlace = data.result;

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

    const updatedPlace: Partial<Place> = {
      ...place,
      name: googlePlace.name ?? place.name,
      lat: googlePlace.geometry?.location?.lat ?? place.lat,
      lng: googlePlace.geometry?.location?.lng ?? place.lng,
      check_date: new Date(),
      business_status: googlePlace.business_status ?? place.business_status,
      photo_refs: googlePlace.photos
        ? googlePlace.photos.slice(1, 5).map((photo) => photo.photo_reference)
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

      dine_in: googlePlace.dine_in ?? place.amenities?.dine_in ?? undefined,
      wheelchair_accessible: googlePlace.wheelchair_accessible_entrance
        ? 'yes'
        : (place.amenities?.wheelchair_accessible ?? undefined),
      serves_beer: googlePlace.serves_beer ?? place.serves_beer ?? undefined,
      serves_breakfast:
        googlePlace.serves_breakfast ?? place.serves_breakfast ?? undefined,
      serves_brunch:
        googlePlace.serves_brunch ?? place.serves_brunch ?? undefined,
      serves_dinner:
        googlePlace.serves_dinner ?? place.serves_dinner ?? undefined,
      serves_lunch: googlePlace.serves_lunch ?? place.serves_lunch ?? undefined,
      serves_vegetarian_food:
        googlePlace.serves_vegetarian_food ??
        place.serves_vegetarian_food ??
        undefined,
      serves_wine: googlePlace.serves_wine ?? place.serves_wine ?? undefined,

      phone:
        googlePlace.formatted_phone_number ??
        googlePlace.international_phone_number ??
        place.phone ??
        undefined,
      website: googlePlace.website ?? place.website ?? undefined,
      google_maps: googlePlace.url ?? place.google_maps ?? undefined,
      opening_hours:
        googlePlace.opening_hours?.weekday_text ??
        place?.opening_hours ??
        undefined,
      price_level: googlePlace.price_level ?? place?.price_level ?? undefined,
      description:
        googlePlace.editorial_summary?.overview ??
        place?.description ??
        undefined,

      rating_score: googlePlace.rating ?? place?.rating_score ?? undefined,
      rating_count:
        googlePlace.user_ratings_total ?? place?.rating_count ?? undefined
    };

    // Update missing info with OSM data

    const { error } = await supabase
      .from('places')
      .update(updatedPlace)
      .eq('id', place.id);

    if (error) {
      throw error;
    }

    console.log('Place updated with Google Data successfully');

    // await uploadPlacePhotosToSupabase(updatedPlace as Place);

    return updatedPlace as Place;
  } catch (error) {
    console.error('Error updating place:', error);
    return place;
  }
};

export default updateGooglePlaceData;
