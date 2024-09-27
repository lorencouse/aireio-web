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
  if (!placeId || !amenityName || !value) {
    console.error('Missing required parameters');
    return false;
  }

  const formattedAmenityName = amenityName.replace(/\s+/g, '_').toLowerCase();

  // Prepare the data to be upserted
  const upsertData: Partial<UserSubmittedPlaceDetails> = {
    place_id: placeId,
    user_id: user.id,
    // updated: new Date().toString(),
    [formattedAmenityName]: value // Dynamically updating the amenity field
  };

  // Attempt to upsert the data
  const { error } = await supabase
    .from('user_submitted_place_details')
    .upsert(upsertData, {
      onConflict: ['place_id', 'user_id'] // Ensure both columns are checked for conflicts
    });

  if (error) {
    console.error('Error upserting user place data:', error);
    return false;
  }

  return true;
};
