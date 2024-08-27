import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';

import { Database } from '@/types/supabase';

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
      oms_place_id: osmData.id?.toString(),
      address: {
        ...place.address,
        add_1:
          place.address.add_1 === undefined || place.address.add_1 === ''
            ? `${osmData.tags['addr:housenumber'] || ''} ${
                osmData.tags['addr:street'] || ''
              }`.trim() || place.address.add_1
            : place.address.add_1,
        level:
          place.address.level === undefined || place.address.level === ''
            ? osmData.tags.level || place.address.level
            : place.address.level,
        city:
          place.address.city === undefined || place.address.city === ''
            ? osmData.tags['addr:city'] || place.address.city
            : place.address.city,
        state:
          place.address.state === undefined || place.address.state === ''
            ? osmData.tags['addr:state'] || place.address.state
            : place.address.state,
        postal_code:
          place.address.postal_code === undefined ||
          place.address.postal_code === ''
            ? osmData.tags['addr:postcode'] || place.address.postal_code
            : place.address.postal_code,
      },
      contact: {
        ...place.contact,
        phone:
          place.contact.phone === undefined || place.contact.phone === ''
            ? osmData.tags.phone || place.contact.phone
            : place.contact.phone,
        website:
          place.contact.website === undefined || place.contact.website === ''
            ? osmData.tags.website || place.contact.website
            : place.contact.website,
        facebook: osmData.tags['contact:facebook'] || place.contact.facebook,
        instagram: osmData.tags['contact:instagram'] || place.contact.instagram,
        mastodon: osmData.tags['contact:mastodon'] || place.contact.mastodon,
        tiktok: osmData.tags['contact:tiktok'] || place.contact.tiktok,
        twitter: osmData.tags['contact:twitter'] || place.contact.twitter,
        youtube: osmData.tags['contact:youtube'] || place.contact.youtube,
        email: osmData.tags.email || place.contact.email,
      },
      amenities: {
        ...place.amenities,
        outdoor_seating:
          osmData.tags.outdoor_seating || place.amenities.outdoor_seating,
        indoor_seating:
          osmData.tags.indoor_seating || place.amenities.indoor_seating,
        toilet: osmData.tags.toilet || place.amenities.toilet,
        power_outlets: osmData.tags.outlets || place.amenities.power_outlets,
        internet_access:
          place.amenities.internet_access === undefined
            ? (osmData.tags.internet_access as 'yes' | 'no' | 'wlan') ||
              place.amenities.internet_access
            : place.amenities.internet_access,
        internet_access_fee:
          place.amenities.internet_access_fee === undefined
            ? osmData.tags['internet_access:fee'] ||
              place.amenities.internet_access_fee
            : place.amenities.internet_access_fee,
        dine_in:
          place.amenities.dine_in === undefined
            ? osmData.tags.dine_in === 'yes'
            : place.amenities.dine_in,
        takeaway:
          place.amenities.takeaway === undefined
            ? (osmData.tags.takeaway as 'only' | 'yes' | 'no') ||
              place.amenities.takeaway
            : place.amenities.takeaway,
        wheelchair_accessible:
          place.amenities.wheelchair_accessible === undefined
            ? (osmData.tags.wheelchair as 'limited' | 'yes' | 'no') ||
              place.amenities.wheelchair_accessible
            : place.amenities.wheelchair_accessible,
        serves_beer:
          place.amenities.serves_beer === undefined
            ? osmData.tags['drink:beer'] === 'yes'
            : place.amenities.serves_beer,
        serves_vegetarian_food:
          place.amenities.serves_vegetarian_food === undefined
            ? osmData.tags['diet:vegetarian'] === 'yes'
            : place.amenities.serves_vegetarian_food,
        serves_vegan_food:
          place.amenities.serves_vegan_food === undefined
            ? osmData.tags['diet:vegan'] === 'yes'
            : place.amenities.serves_vegan_food,
        serves_wine:
          place.amenities.serves_wine === undefined
            ? osmData.tags['drink:wine'] === 'yes'
            : place.amenities.serves_wine,
      },
      tags: {
        ...place.tags,
        brand: osmData.tags.brand || place.tags.brand,
        brand_wikidata:
          osmData.tags['brand:wikidata'] || place.tags.brand_wikidata,
        cost_coffee: osmData.tags['cost:coffee'] || place.tags.cost_coffee,
        note: osmData.tags.note || place.tags.note,
        description:
          place.tags.description === undefined || place.tags.description === ''
            ? osmData.tags.description || place.tags.description
            : place.tags.description,
        opening_hours:
          place.tags.opening_hours === undefined ||
          place.tags.opening_hours === ''
            ? formatOpeningHours(osmData.tags.opening_hours) ||
              place.tags.opening_hours
            : place.tags.opening_hours,
      },
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
  type: 'cafe' | 'library' | 'coworking',
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
        'User-Agent': 'YourApp/1.0',
      },
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
      error.response?.data || error.message,
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

const formatOpeningHours = (hours: string) => {
  if (!hours) return hours;
  return hours.replace(/[;,.]/g, '\n').trim();
};
