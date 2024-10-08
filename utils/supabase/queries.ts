import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';
import { User } from '@supabase/supabase-js';
import { Database } from '@/types_db';

export const getUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getUserProfile = async () => {
  const supabase = createClient();
  const user: User | null = await getUser();

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

// export const getUser = cache(async (supabase: SupabaseClient) => {
//   const {
//     data: { user }
//   } = await supabase.auth.getUser();
//   return user;
// });

// export const getUserDetails = cache(async (supabase: SupabaseClient) => {
//   const { data: userDetails } = await supabase
//     .from('user_profiles')
//     .select('*')
//     .single();
//   return userDetails;
// });
