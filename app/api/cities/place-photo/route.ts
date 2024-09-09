import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const maxWidth = searchParams.get('maxWidth') || '400';
  const photoReference = searchParams.get('photoRef');
  // const type = searchParams.get('type');
  const imageName = searchParams.get('imageName');
  const placeId = searchParams.get('placeId');
  const cityId = searchParams.get('cityId');

  if (!photoReference || !imageName || !placeId || !cityId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY is not set');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;

  try {
    const success = await uploadImageToSupabase(
      url,
      `${imageName}`,
      `places/${cityId}/${placeId}`
    );
    if (success) {
      console.log('Place photo uploaded to Supabase');
      return NextResponse.json(
        { message: 'Photo uploaded successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to upload image to Supabase' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    return NextResponse.json(
      { error: 'Error uploading image to Supabase', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
