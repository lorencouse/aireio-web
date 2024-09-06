import React from 'react';

const getSupabasePlacePhotoUrl = (type: string, photoRef: string): string => {
  if (!photoRef || !type || photoRef === 'undefined') return '/images/logo.png';
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/places/${type}/${photoRef}.jpg`;
};

export default getSupabasePlacePhotoUrl;
