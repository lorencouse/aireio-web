// actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export const SubmitUserPlaceData = async (
  placeId: string,
  amenityName: string,
  value: boolean
): Promise<{ success: boolean; error?: string; authError?: boolean }> => {
  const supabase = createClient();

  // Check if the user is authenticated
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'User not authenticated', authError: true };
  }

  if (!placeId || !amenityName || typeof value !== 'boolean') {
    return { success: false, error: 'Missing required parameters' };
  }

  const formattedAmenityName = amenityName.replace(/\s+/g, '_').toLowerCase();

  const upsertData = {
    place_id: placeId,
    user_id: user.id,
    [formattedAmenityName]: value,
    updated: new Date().toISOString()
  };

  const { error } = await supabase
    .from('user_submitted_place_details')
    .upsert(upsertData, {
      onConflict: 'place_id,user_id'
    });

  if (error) {
    console.error('Error upserting user place data:', error);
    return { success: false, error: 'Failed to submit data' };
  }

  return { success: true };
};
