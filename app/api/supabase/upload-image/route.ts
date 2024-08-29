import useSupabase from '@/utils/hook/useSupabase';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request) {
  const { imageUrl, imgName, dir } = await request.json();

  try {
    const response = await fetch(imageUrl, {
      headers: {}
    });

    if (
      !response.ok ||
      !response.headers.get('content-type')?.includes('image')
    ) {
      throw new Error(
        'Failed to fetch image from the URL or invalid content type'
      );
    }

    // Convert the response to an array buffer and then to a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the image to Supabase Storage
    const filePath = `${dir}/${imgName}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, { upsert: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
