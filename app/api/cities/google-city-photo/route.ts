// src/app/api/cities/google-city-photo/route.ts

import axios from 'axios';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY; // Remove NEXT_PUBLIC_

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

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Error fetching photo', details: error.message },
      { status: 500 }
    );
  }
}
