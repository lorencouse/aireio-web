import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getUserProfile = async () => {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) return null;

  const { data: userProfile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !userProfile) {
    console.log(`Could not get user profile for user id: ${user.id}`, {
      error,
      userProfile
    });
    return null;
  }

  return userProfile;
};

export const getUserSubmittedPlaceDetails = async (placeId: string) => {
  const supabase = await createClient();

  if (!placeId) return [];

  const { data: details, error } = await supabase
    .from('amenity_submissions')
    .select('*')
    .eq('place_id', placeId);

  if (error || !details) {
    console.log(
      `Could not get user submitted place details for place id: ${placeId}`,
      {
        error,
        details
      }
    );
    return [];
  }

  return details;
};
