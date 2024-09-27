'use server';
import { UserSubmittedPlaceDetails } from '@/utils/types';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/queries';

export const SubmitUserPlaceData = async (
  placeId: string,
  amenityName: string,
  value: boolean
): Promise<boolean> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    console.error('User not authenticated');
    return false;
  }
  if (!placeId || !amenityName || typeof value !== 'boolean') {
    console.error('Missing required parameters');
    return false;
  }

  const formattedAmenityName = amenityName.replace(/\s+/g, '_').toLowerCase();

  // Prepare the data to be upserted
  const upsertData: {
    place_id: string;
    user_id: string;
    updated: string;
    [key: string]: string | boolean;
  } = {
    place_id: placeId,
    user_id: user.id,
    [formattedAmenityName]: value,
    updated: new Date().toISOString()
  };

  // Attempt to upsert the data
  const { error } = await supabase
    .from('user_submitted_place_details')
    .upsert(upsertData, {
      onConflict: 'place_id,user_id'
    });

  if (error) {
    console.error('Error upserting user place data:', error);
    return false;
  }

  return true;
};
