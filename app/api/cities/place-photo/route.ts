// app/api/cities/place-photo/route.ts

import axios from 'axios';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const maxWidth = searchParams.get('maxWidth') || '400';
  const photoReference = searchParams.get('photoReference');

  if (!photoReference) {
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
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: 'Error fetching photo', details: error.response.data },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: 'Error fetching photo', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';