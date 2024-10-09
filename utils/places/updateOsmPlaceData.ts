import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '../supabase/server';
import { Place } from '../types';

import calcDistance from './calcDistance';

function convertStringToBool(value: string | boolean | null): boolean | null {
  if (typeof value === 'boolean') return value;
  if (value === null) return null;
  return value.toLowerCase() === 'yes';
}

const updateOsmPlaceData = async (place: Place) => {
  const { lat, lng, type } = place;
  const osmData = await fetchOSMDetails(lng, lat, type);
  const supabase = createClient();

  if (!osmData) {
    console.log('No matching OSM data found');
    return place;
  }

  try {
    const updatedPlace: Place = {
      ...place,
      osm_id: osmData.id?.toString(),
      add_1:
        place.add_1 === null || place.add_1 === ''
          ? `${osmData.tags['addr:housenumber'] || ''} ${
              osmData.tags['addr:street'] || ''
            }`.trim() || place.add_1
          : place.add_1,
      level:
        place.level === null || place.level === ''
          ? osmData.tags.level || place.level
          : place.level,
      city:
        place.city === null || place.city === ''
          ? osmData.tags['addr:city'] || place.city
          : place.city,
      state:
        place.state === null || place.state === ''
          ? osmData.tags['addr:state'] || place.state
          : place.state,
      postal_code:
        place.postal_code === null || place.postal_code === ''
          ? osmData.tags['addr:postcode'] || place.postal_code
          : place.postal_code,
      phone:
        place.phone === null || place.phone === ''
          ? osmData.tags.phone || place.phone
          : place.phone,
      website:
        place.website === null || place.website === ''
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
        place.description === null || place.description === ''
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
  type: string
) => {
  try {
    let amenityType = type === 'coworking' ? 'coworking_space' : type;

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

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'YourApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Sort results by distance and get the closest match
    const elements = data.elements;
    if (elements.length > 0) {
      const sortedElements = elements.sort(
        (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
          const distA = calcDistance(
            { lat: latitude, lng: longitude },
            { lat: a.lat, lng: a.lon }
          );
          const distB = calcDistance(
            { lat: latitude, lng: longitude },
            { lat: b.lat, lng: b.lon }
          );
          return distA - distB;
        }
      );
      return sortedElements[0]; // Return the closest match
    }
    return null; // No match found
  } catch (error) {
    console.error('Error fetching OSM data:', error);
    return null;
  }
};
