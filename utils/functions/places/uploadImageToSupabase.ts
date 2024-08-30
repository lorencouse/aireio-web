'use server';

import { createClient } from '@/utils/supabase/server';

const uploadImageToSupabase = async (
  imageUrl: string,
  imgName: string,
  dir: string
) => {
  const supabase = createClient();

  try {
    const response = await fetch(imageUrl);

    if (
      !response.ok ||
      !response.headers.get('content-type')?.includes('image')
    ) {
      throw new Error(
        'Failed to fetch image from the URL or invalid content type'
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = `${dir}/${imgName}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, { upsert: true });

    if (error) {
      throw error;
    }

    return true;

    return true;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return false;
  }
};

export default uploadImageToSupabase;
