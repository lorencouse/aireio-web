import { createClient } from '@supabase/supabase-js';

const uploadImageToSupabase = async (
  imageUrl: string,
  imgName: string,
  dir: string
) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

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
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return false;
  }
};

export default uploadImageToSupabase;
