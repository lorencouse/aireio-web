import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('place_id');

  if (!placeId) {
    return NextResponse.json(
      { error: 'Place ID is required' },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          fields:
            'name,address_components,formatted_address,formatted_phone_number,international_phone_number,website,opening_hours,photos,rating,user_ratings_total,price_level,types,business_status,geometry,editorial_summary,dine_in,serves_beer,serves_breakfast,serves_brunch,serves_dinner,serves_lunch,serves_vegetarian_food,serves_wine,takeout,wheelchair_accessible_entrance,url',
          key: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json(
      { error: 'Error fetching place details' },
      { status: 500 },
    );
  }
}
