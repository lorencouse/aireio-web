import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';

import convertGoogleAddress from '@/utils/places/convertGoogleAddress';

import addPlaceToBlacklist from './addPlaceToBlacklist';

import { Database } from '@/types/supabase';

export const updateGooglePlaceData = async (place: Place) => {
  const supabase = createClientComponentClient<Database>();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const res = await axios.get(
      `/api/places/google-place-details?placeId=${place.google_place_id}`,
    );
    if (!res.status === 200) {
      throw new Error('Network response was not ok');
    }
    const data = await res.data;
    const googlePlace = data.result;

    if (!googlePlace.dine_in && place.type === 'cafe') {
      addPlaceToBlacklist(place);
      return null;
    }

    console.log('Google Place Photos:', googlePlace.photos);

    const convertedAddress = convertGoogleAddress(
      googlePlace.address_components,
    );

    const updatedPlace: Partial<Place> = {
      ...place,
      name: googlePlace.name ?? place.name,
      lat: googlePlace.geometry?.location?.lat ?? place.lat,
      lng: googlePlace.geometry?.location?.lng ?? place.lng,
      check_date: new Date(),
      business_status: googlePlace.business_status ?? place.business_status,
      photos: googlePlace.photos
        ? googlePlace.photos.map((photo) => ({
            ref: photo.photo_reference,
            url: '',
          }))
        : place.photos,
      address: {
        ...place.address,
        ...convertedAddress,
        formatted_address:
          googlePlace.formatted_address ?? place.address?.formatted_address,
      },
      amenities: {
        ...place.amenities,
        internet_access: place.amenities?.internet_access ?? undefined,
        dine_in: googlePlace.dine_in ?? place.amenities?.dine_in ?? undefined,
        outdoor_seating: place.amenities?.outdoor_seating ?? undefined,
        indoor_seating: place.amenities?.indoor_seating ?? undefined,
        takeaway: googlePlace.takeout
          ? 'yes'
          : (place.amenities?.takeaway ?? undefined),
        toilet: place.amenities?.toilet ?? undefined,
        power_outlets: place.amenities?.power_outlets ?? undefined,
        wheelchair_accessible: googlePlace.wheelchair_accessible_entrance
          ? 'yes'
          : (place.amenities?.wheelchair_accessible ?? undefined),
        parking: place.amenities?.parking ?? undefined,
        parking_fee: place.amenities?.parking_fee ?? undefined,
        serves_beer:
          googlePlace.serves_beer ?? place.amenities?.serves_beer ?? undefined,
        serves_breakfast:
          googlePlace.serves_breakfast ??
          place.amenities?.serves_breakfast ??
          undefined,
        serves_brunch:
          googlePlace.serves_brunch ??
          place.amenities?.serves_brunch ??
          undefined,
        serves_dinner:
          googlePlace.serves_dinner ??
          place.amenities?.serves_dinner ??
          undefined,
        serves_lunch:
          googlePlace.serves_lunch ??
          place.amenities?.serves_lunch ??
          undefined,
        serves_vegetarian_food:
          googlePlace.serves_vegetarian_food ??
          place.amenities?.serves_vegetarian_food ??
          undefined,
        serves_wine:
          googlePlace.serves_wine ?? place.amenities?.serves_wine ?? undefined,
      },
      contact: {
        phone:
          googlePlace.formatted_phone_number ??
          googlePlace.international_phone_number ??
          place.contact?.phone ??
          undefined,
        website: googlePlace.website ?? place.contact?.website ?? undefined,
        google_maps: googlePlace.url ?? place.contact?.google_maps ?? undefined,
      },
      tags: {
        ...place.tags,
        brand: place.tags?.brand ?? undefined,
        brand_wikidata: place.tags?.brand_wikidata ?? undefined,
        opening_hours:
          googlePlace.opening_hours?.weekday_text?.join('; ') ??
          place.tags?.opening_hours ??
          undefined,
        cost: googlePlace.price_level ?? place.tags?.cost ?? undefined,
        description:
          googlePlace.editorial_summary?.overview ??
          place.tags?.description ??
          undefined,
      },
      google_rating: {
        score: googlePlace.rating ?? place.google_rating?.score ?? undefined,
        count:
          googlePlace.user_ratings_total ??
          place.google_rating?.count ??
          undefined,
      },
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
    return updatedPlace as Place;
  } catch (error) {
    console.error('Error updating place:', error);
    return place;
  }
};

export default updateGooglePlaceData;
