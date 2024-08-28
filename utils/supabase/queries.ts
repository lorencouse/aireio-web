import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const getUser = cache(async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user, error }
  } = await supabase.auth.getUser();

  if (error) {
    console.log('Could not get user', error);
    return null;
  }

  return user;
});

export const getUserProfile = cache(async () => {
  const supabase = createServerComponentClient({ cookies });
  const user = await getUser();

  if (!user) return null;

  const { userProfile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !userProfile) {
    console.log(`Could not get user profile for user id: ${user.id}`, error);
    return null;
  }

  return userProfile;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

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

// export const getProducts = cache(async (supabase: SupabaseClient) => {
//   const { data: products, error } = await supabase
//     .from('products')
//     .select('*, prices(*)')
//     .eq('active', true)
//     .eq('prices.active', true)
//     .order('metadata->index')
//     .order('unit_amount', { referencedTable: 'prices' });

//   return products;
// });
