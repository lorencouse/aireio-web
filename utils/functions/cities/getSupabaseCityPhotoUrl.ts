import React from 'react';

export const getSupabaseCityPhotoUrl = (
  cityName: string,
  stateName: string,
  countryCode: string
): string => {
  const imageName = `${countryCode}_${stateName}_${cityName}.jpg`;

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/cities/${imageName}`;
};
