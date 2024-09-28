import React from 'react';

export const getSupabaseCityPhotoUrl = (
  city: string,
  state: string,
  countryCode: string
): string => {
  const image = `${countryCode}_${state}_${city}.jpg`;
  console.log('getSupabaseCityPhotoUrl:', image);

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/cities/${image}`;
};
