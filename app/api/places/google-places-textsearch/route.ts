import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const lng = searchParams.get('lng');
  const lat = searchParams.get('lat');
  const radius = searchParams.get('radius');
  const pageToken = searchParams.get('pagetoken');

  if (!lat || !lng || !radius || !query) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    );
  }

  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lng}&query=${query}&radius=${radius}&key=${API_KEY}`;

  if (pageToken) {
    url += `&pagetoken=${pageToken}`;
  }

  try {
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching nearby places', details: error.message },
      { status: 500 },
    );
  }
}
