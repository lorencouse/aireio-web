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
      .select('id')
      .eq('google_id', google_id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (existingCity) {
      return NextResponse.json({ exists: true, cityId: existingCity.id });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking city existence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
