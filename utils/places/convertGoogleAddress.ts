'use server';

import { normalizeString } from '@/app/_components/actions';

export default async function convertGoogleAddress(
  addressComponents: any[]
): Promise<{
  add_1: string;
  add_2?: string;
  level?: string;
  district?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}> {
  const result: any = {};

  // Helper function to find a component by type
  const findComponent = (type: string) =>
    addressComponents.find((component) => component.types.includes(type));

  // street_number + route
  const streetNumber = findComponent('street_number');
  const route = findComponent('route');
  result.add_1 = await normalizeString(
    (streetNumber ? streetNumber.long_name + ' ' : '') +
      (route ? route.long_name : '')
  );

  // add_2 and level are not typically provided by Google Places API
  // You might need to get these from a different source or user input
  result.add_2 = undefined;
  result.level = undefined;

  // district (neighborhood)
  const neighborhood = findComponent('neighborhood');
  result.district = neighborhood
    ? await normalizeString(neighborhood.long_name)
    : undefined;

  // city (locality)
  const locality = findComponent('locality');
  result.city = locality
    ? await normalizeString(locality.long_name)
    : undefined;

  // county (administrative_area_level_2)
  const county = findComponent('administrative_area_level_2');
  result.county = county ? await normalizeString(county.long_name) : undefined;

  // state (administrative_area_level_1)
  const state = findComponent('administrative_area_level_1');
  result.state = state ? await normalizeString(state.long_name) : undefined;

  // postcode
  const postcode = findComponent('postal_code');
  result.postcode = postcode
    ? await normalizeString(postcode.long_name)
    : undefined;

  // country
  const country = findComponent('country');
  result.country = country
    ? await normalizeString(country.long_name)
    : undefined;

  return result;
}
