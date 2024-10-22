// actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types_db';
type UserSubmittedPlaceDetailsInsert =
  Database['public']['Tables']['user_submitted_place_details']['Insert'];

export const SubmitUserPlaceInfo = async (
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

  const upsertData: UserSubmittedPlaceDetailsInsert = {
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

export const toggleFavorite = async (
  placeId: string,
  isFavoriting: boolean
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

  if (!placeId) {
    return { success: false, error: 'Missing place ID' };
  }

  const upsertData: UserSubmittedPlaceDetailsInsert = {
    place_id: placeId,
    user_id: user.id,
    favorited: isFavoriting ? new Date().toISOString() : null,
    updated: new Date().toISOString()
  };

  const { error } = await supabase
    .from('user_submitted_place_details')
    .upsert(upsertData, {
      onConflict: 'place_id,user_id'
    });

  if (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed to update favorite status' };
  }

  return { success: true };
};

// Helper function to check if a place is favorited
export const getFavoriteStatus = async (
  placeId: string
): Promise<{ favorited: boolean; error?: string; authError?: boolean }> => {
  const supabase = createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      favorited: false,
      error: 'User not authenticated',
      authError: true
    };
  }

  const { data, error } = await supabase
    .from('user_submitted_place_details')
    .select('favorited')
    .eq('place_id', placeId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found"
    console.error('Error checking favorite status:', error);
    return { favorited: false, error: 'Failed to check favorite status' };
  }

  return { favorited: !!data?.favorited };
};

// Helper function to get all favorited places
export const getFavoritedPlaces = async (
  page = 1,
  limit = 10
): Promise<{
  places: Array<{ place_id: string; favorited: string | null }>;
  count: number;
  error?: string;
  authError?: boolean;
}> => {
  const supabase = createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      places: [],
      count: 0,
      error: 'User not authenticated',
      authError: true
    };
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('user_submitted_place_details')
    .select('place_id, favorited', { count: 'exact' })
    .eq('user_id', user.id)
    .not('favorited', 'is', null)
    .order('favorited', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching favorited places:', error);
    return { places: [], count: 0, error: 'Failed to fetch favorited places' };
  }

  return {
    places: data || [],
    count: count || 0
  };
};
