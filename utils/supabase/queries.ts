import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';
import { createClient } from '@supabase/supabase-js';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { User } from '@supabase/supabase-js';
import { Database } from '@/types_db';

export const getUser = cache(async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

// export const getUser = cache(async () => {
//   const {
//     data: { user, error }
//   } = await supabase.auth.getUser();

//   if (error) {
//     console.log('Could not get user', error);
//     return null;
//   }

//   return user;
// });

export const getUserProfile = async () => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
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
