// actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export const SubmitUserPlaceInfo = async (
  placeId: string,
  amenityName: string,
  value: string
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

  if (!placeId || !amenityName || !value) {
    return { success: false, error: 'Missing required parameters' };
  }

  const formattedAmenityName = amenityName.replace(/\s+/g, '_').toLowerCase();

  const { error } = await supabase.from('amenity_submissions').upsert(
    {
      place_id: placeId,
      user_id: user.id,
      amenity_name: formattedAmenityName,
      value,
      timestamp: new Date().toISOString()
    },
    {
      onConflict: 'place_id,user_id,amenity_name'
    }
  );

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

  if (!isFavoriting) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('place_id', placeId)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: 'Failed remove from favorites' };
    }
    return { success: true };
  }

  // Add to favorites
  const { error } = await supabase.from('favorites').insert({
    place_id: placeId,
    user_id: user.id
  });

  if (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed add to favorites' };
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
    .from('favorites')
    .select('*')
    .eq('place_id', placeId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found"
    console.error('Error checking favorite status:', error);
    return { favorited: false, error: 'Failed to check favorite status' };
  }

  return { favorited: !!data };
};

// Helper function to get all favorited places
export const getFavoritedPlaces = async (
  page = 1,
  limit = 10
): Promise<{
  places: { place_id: string }[];
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
    .from('favorites')
    .select('place_id', { count: 'exact' })
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
