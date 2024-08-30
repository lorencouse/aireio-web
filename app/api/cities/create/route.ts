// app/api/cities/create/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import uploadImageToSupabase from '@/utils/functions/places/uploadImageToSupabase';

export async function POST(request: Request) {
  const supabase = createClient();
  const cityData = await request.json();

  try {
    // Create new city
    const { data: newCity, error: insertError } = await supabase
      .from('cities')
      .insert(cityData)
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    const cityId = newCity.id;

    // Handle photo upload if available
    if (cityData.photoUrl) {
      const imgName = `${cityData.country_code}_${cityData.name}_${cityId}.jpg`;
      const success = await uploadImageToSupabase(
        cityData.photoUrl,
        imgName,
        'cities'
      );

      if (success) {
        await supabase
          .from('cities')
          .update({ photo_ref: imgName })
          .eq('id', cityId);
      }
    }

    return NextResponse.json(
      { cityId, message: 'City created successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in city creation:', error);
    return NextResponse.json(
      { message: 'Error creating city', error: error.message },
      { status: 500 }
    );
  }
}
