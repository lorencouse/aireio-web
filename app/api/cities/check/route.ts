import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request) {
  try {
    const { google_id } = await request.json();

    const { data: existingCity, error } = await supabase
      .from('cities')
      .select('id, lat, lng, country_code, state, name')
      .eq('google_id', google_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No matching row found
        return NextResponse.json({ exists: false });
      }
      throw error;
    }

    if (existingCity) {
      return NextResponse.json({
        exists: true,
        id: existingCity.id,
        lat: existingCity.lat,
        lng: existingCity.lng,
        name: existingCity.name,
        country_code: existingCity.country_code,
        state: existingCity.state
      });
    }
  } catch (error) {
    console.error('Error checking city existence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
