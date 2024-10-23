'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';
import { City } from '@/utils/types';

export async function normalizeString(str: string | null): Promise<string> {
  if (!str) return '';

  const accentMap: { [key: string]: string } = {
    // Existing characters
    á: 'a',
    à: 'a',
    â: 'a',
    ä: 'a',
    ã: 'a',
    å: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    í: 'i',
    ì: 'i',
    î: 'i',
    ï: 'i',
    ó: 'o',
    ò: 'o',
    ô: 'o',
    ö: 'o',
    õ: 'o',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ü: 'u',
    ñ: 'n',
    ç: 'c',
    ß: 'ss',
    ÿ: 'y',

    // Vietnamese specific characters
    ạ: 'a',
    ả: 'a',
    ấ: 'a',
    ầ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    ắ: 'a',
    ằ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    ă: 'a',
    ẹ: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ế: 'e',
    ề: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    ị: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ọ: 'o',
    ỏ: 'o',
    ố: 'o',
    ồ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ớ: 'o',
    ờ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ơ: 'o',
    ụ: 'u',
    ủ: 'u',
    ũ: 'u',
    ứ: 'u',
    ừ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ư: 'u',
    ỳ: 'y',
    ỵ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    đ: 'd'
  };

  return str
    .toLowerCase()
    .replace(/[^\u0000-\u007E]/g, (char) => accentMap[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const fetchCity = async (city: Partial<City>) => {
  const supabase = createClient();
  const {
    name,
    country,
    country_code,
    state,
    state_code,
    google_id,
    lat,
    lng
  } = city;

  if (
    !name ||
    !country ||
    !country_code ||
    !state ||
    !state_code ||
    !google_id ||
    lat === undefined ||
    lng === undefined
  ) {
    throw new Error('Missing required fields for city');
  }

  const normalizedName = await normalizeString(name);
  const normalizedState = await normalizeString(state);
  const normalizedCountry = await normalizeString(country);

  try {
    await supabase
      .from('cities')
      .insert({
        name: normalizedName,
        lat,
        lng,
        country: normalizedCountry,
        country_code,
        state: normalizedState,
        state_code,
        google_id
      })
      .select()
      .single();

    redirect(`/cities/${country_code}/${normalizedState}/${normalizedName}`);
  } catch (error) {
    console.error('Unexpected error in fetchCity:', error);
    throw error;
  }
};

interface GooglePlacePhotoResponse {
  result?: {
    photos?: Array<{
      photo_reference: string;
    }>;
  };
  status: string;
  error_message?: string;
}

export const uploadCityPhoto = async (
  city: City
): Promise<{
  success: boolean;
  message: string;
  photoRef?: string;
}> => {
  const supabase = createClient();
  const maxWidth = 1200;
  const normalizedName = await normalizeString(city.name);
  const normalizedState = await normalizeString(city.state);

  try {
    // 1. Fetch photo reference from Google Places API
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${city.google_id}&fields=photos&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    );

    if (!res.ok) {
      throw new Error(
        `Google Places API error: ${res.status} ${res.statusText}`
      );
    }

    const data: GooglePlacePhotoResponse = await res.json();

    if (data.status !== 'OK') {
      throw new Error(
        `Google Places API returned status: ${data.status} - ${data.error_message || 'Unknown error'}`
      );
    }

    const photoRef = data.result?.photos?.[0]?.photo_reference;

    if (!photoRef) {
      return {
        success: false,
        message: `No photos available for ${city.name}`
      };
    }

    // 2. Construct the image URL and name
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;
    const imgName = `${city.country_code}_${normalizedState}_${normalizedName}.jpg`;

    // 3. Upload the image to Supabase storage
    const success = await uploadImageToSupabase(
      googlePhotoUrl,
      imgName,
      'cities'
    );

    if (!success) {
      throw new Error('Failed to upload image to Supabase storage');
    }

    // 4. Update the city record with the new photo reference
    const { error: updateError } = await supabase
      .from('cities')
      .update({ photo_ref: photoRef })
      .eq('google_id', city.google_id);

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      message: 'Successfully uploaded and updated city photo',
      photoRef
    };
  } catch (error) {
    console.error('Error in uploadCityPhoto:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
