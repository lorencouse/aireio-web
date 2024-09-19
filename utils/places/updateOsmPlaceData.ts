import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';

import { Database } from '@/types/supabase';

function convertStringToBool(
  value: string | boolean | undefined
): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (value === undefined) return undefined;
  return value.toLowerCase() === 'yes';
}

const updateOsmPlaceData = async (place: Place) => {
  const { lat, lng, type } = place;
  const osmData = await fetchOSMDetails(lng, lat, type);
  const supabase = createClientComponentClient<Database>();

  if (!osmData) {
    console.log('No matching OSM data found');
    return place;
  }

  try {
    const updatedPlace: Place = {
      ...place,
      oms_id: osmData.id?.toString(),
      add_1:
        place.add_1 === undefined || place.add_1 === ''
          ? `${osmData.tags['addr:housenumber'] || ''} ${
              osmData.tags['addr:street'] || ''
            }`.trim() || place.add_1
          : place.add_1,
      level:
        place.level === undefined || place.level === ''
          ? osmData.tags.level || place.level
          : place.level,
      city:
        place.city === undefined || place.city === ''
          ? osmData.tags['addr:city'] || place.city
          : place.city,
      state:
        place.state === undefined || place.state === ''
          ? osmData.tags['addr:state'] || place.state
          : place.state,
      postal_code:
        place.postal_code === undefined || place.postal_code === ''
          ? osmData.tags['addr:postcode'] || place.postal_code
          : place.postal_code,
      phone:
        place.phone === undefined || place.phone === ''
          ? osmData.tags.phone || place.phone
          : place.phone,
      website:
        place.website === undefined || place.website === ''
          ? osmData.tags.website || place.website
          : place.website,
      facebook: osmData.tags['contact:facebook'] || place.facebook,
      instagram: osmData.tags['contact:instagram'] || place.instagram,
      mastodon: osmData.tags['contact:mastodon'] || place.mastodon,
      tiktok: osmData.tags['contact:tiktok'] || place.tiktok,
      twitter: osmData.tags['contact:twitter'] || place.twitter,
      youtube: osmData.tags['contact:youtube'] || place.youtube,
      email: osmData.tags.email || place.email,
      outdoor_seating:
        place.outdoor_seating ??
        convertStringToBool(osmData.tags.outdoor_seating),
      indoor_seating:
        place.indoor_seating ??
        convertStringToBool(osmData.tags.indoor_seating),
      toilet: place.toilet ?? convertStringToBool(osmData.tags.toilet),
      power_outlets:
        place.power_outlets ?? convertStringToBool(osmData.tags.outlets),
      internet_access:
        place.internet_access ??
        convertStringToBool(
          osmData.tags.internet_access === 'wlan'
            ? 'yes'
            : osmData.tags.internet_access
        ),
      internet_access_fee:
        place.internet_access_fee ??
        convertStringToBool(osmData.tags['internet_access:fee']),
      dine_in: place.dine_in ?? convertStringToBool(osmData.tags.dine_in),
      takeaway: place.takeaway ?? convertStringToBool(osmData.tags.takeaway),
      wheelchair_accessible:
        place.wheelchair_accessible ??
        convertStringToBool(osmData.tags.wheelchair),
      serves_beer:
        place.serves_beer ?? convertStringToBool(osmData.tags['drink:beer']),
      serves_vegetarian_food:
        place.serves_vegetarian_food ??
        convertStringToBool(osmData.tags['diet:vegetarian']),
      serves_vegan_food:
        place.serves_vegan_food ??
        convertStringToBool(osmData.tags['diet:vegan']),
      serves_wine:
        place.serves_wine ?? convertStringToBool(osmData.tags['drink:wine']),
      brand: osmData.tags.brand || place.brand,
      brand_wikidata: osmData.tags['brand:wikidata'] || place.brand_wikidata,
      cost_coffee: osmData.tags['cost:coffee'] || place.cost_coffee,
      note: osmData.tags.note || place.note,
      description:
        place.description === undefined || place.description === ''
          ? osmData.tags.description || place.description
          : place.description
    };
    console.log('Updated with OSM Data');
    const { error } = await supabase
      .from('places')
      .update(updatedPlace)
      .eq('id', place.id);

    if (error) {
      throw error;
    }

    return updatedPlace;

    console.log('Place updated with Google Data successfully');
    return updatedPlace as Place;
  } catch (error) {
    console.error('Error updating place:', error);
    return place;
  }
};

export default updateOsmPlaceData;

const fetchOSMDetails = async (
  longitude: number,
  latitude: number,
  type: 'cafe' | 'library' | 'coworking'
) => {
  try {
    let amenityType = type;
    if (type === 'coworking') {
      amenityType = 'coworking_space';
    }

    const query = `
      [out:json];
      (
        node["amenity"="${amenityType}"](around:100, ${latitude}, ${longitude});
        way["amenity"="${amenityType}"](around:100, ${latitude}, ${longitude});
        relation["amenity"="${amenityType}"](around:100, ${latitude}, ${longitude});
      );
      out body;
      >;
      out skel qt;
    `;

    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourApp/1.0'
      }
    });

    // Sort results by distance and get the closest match
    const elements = response.data.elements;
    if (elements.length > 0) {
      const sortedElements = elements.sort((a, b) => {
        const distA = distance(latitude, longitude, a.lat, a.lng);
        const distB = distance(latitude, longitude, b.lat, b.lng);
        return distA - distB;
      });
      return sortedElements[0]; // Return the closest match
    }
    return null; // No match found
  } catch (error) {
    console.error(
      'Error fetching OSM data:',
      error.response?.data || error.message
    );
    return null;
  }
};

// Helper function to calculate distance between two points
function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// const formatOpeningHours = (hours: string) => {
//   if (!hours) return hours;
//   return hours.replace(/[;,.]/g, '\n').trim();
// };
