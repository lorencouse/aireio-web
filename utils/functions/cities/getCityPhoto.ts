'use server';

import { createClient } from '../../supabase/server';

interface CityPhotoResult {
  imageUrl: string | null;
  cityName: string | null;
  countryCode: string | null;
}

export async function getCityPhoto(cityId: string): Promise<CityPhotoResult> {
  const supabase = createClient();

  try {
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('cities');

    if (listError) throw listError;

    // Debugging logs
    console.log(
      'ID: ' + cityId,
      'Files found:',
      files.map((f) => f.name)
    );

    const file = files.find((f) => f.name.includes(cityId));

    if (!file) {
      console.log('No file found containing cityId:', cityId);
      throw new Error(`No image found for city ID: ${cityId}`);
    }

    console.log('Matching file found:', file.name);

    const [countryCode, cityName] = file.name.split('_');

    const { data, error } = await supabase.storage
      .from('images')
      .getPublicUrl(`cities/${file.name}`);

    if (error || !data)
      throw new Error(error?.message || 'No data returned from Supabase');

    return {
      imageUrl: data.publicUrl,
      cityName: cityName || 'Unknown City',
      countryCode: countryCode || 'Unknown Country'
    };
  } catch (error) {
    console.error('Error fetching image URL:', error);
    return {
      imageUrl: null,
      cityName: null,
      countryCode: null
    };
  }
}
