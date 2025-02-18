// actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { Place } from '@/utils/types';
import updateGooglePlaceData from '@/utils/places/updateGooglePlaceData';
import updateOsmPlaceData from '@/utils/places/updateOsmPlaceData';

export const submitUserPlaceInfo = async (
  placeId: string,
  amenityName: string,
  value: string
): Promise<{ success: boolean; error?: string; authError?: boolean }> => {
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  const supabase = await createClient();

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
export const getFavoritePlaces = async (
  page = 1,
  limit = 10
): Promise<{
  places: { place_id: string }[];
  count: number;
  error?: string;
  authError?: boolean;
}> => {
  const supabase = await createClient();

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

export const updateLike = async (
  placeId: string,
  status: 'like' | 'dislike' | null
): Promise<{ success: boolean; error?: string; authError?: boolean }> => {
  const supabase = await createClient();

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

  if (status === null) {
    const { error } = await supabase
      .from('place_likes')
      .delete()
      .eq('place_id', placeId)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error removing like:', error);
      return { success: false, error: 'Failed remove from likes' };
    }
    return { success: true };
  }

  // Add to likes
  const { error } = await supabase.from('place_likes').upsert({
    is_like: status === 'like' ? true : false,
    place_id: placeId,
    user_id: user.id
  });

  if (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed add to likes' };
  }

  return { success: true };
};

// Helper function to check if a place is liked
export const getLikeStatus = async (
  placeId: string
): Promise<{
  status: 'like' | 'dislike' | null;
  error?: string;
  authError?: boolean;
}> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      status: null,
      error: 'User not authenticated',
      authError: true
    };
  }

  const { data, error } = await supabase
    .from('place_likes')
    .select('*')
    .eq('place_id', placeId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found"
    console.error('Error checking like status:', error);
    return { status: null, error: 'Failed to check like status' };
  }

  if (!data) {
    return { status: null };
  } else if (data.is_like === true) {
    return { status: 'like' };
  } else {
    return { status: 'dislike' };
  }
};

export const getPlacesById = async (placeIds: string[]): Promise<Place[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .in('id', placeIds);
  if (error) {
    console.error('Error fetching places:', error);
    return [];
  }
  return data || [];
};

const checkPlaceIsUpToDate = (place: Place): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (!place.check_date) {
    return false;
  }
  const checkDate = new Date(place.check_date);
  return checkDate >= thirtyDaysAgo;
};

export async function getPlaceData(placeId: string) {
  const supabase = await createClient();

  // Fetch place
  const { data: place, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', placeId)
    .single();

  if (error) throw error;

  // Fetch submissions
  const { data: userSubmissions } = await supabase
    .from('amenity_aggregations')
    .select('*')
    .eq('place_id', placeId);

  // Fetch likes
  const { data: likes } = await supabase
    .from('place_likes')
    .select('*')
    .eq('place_id', placeId);

  let updatedPlace = place as Place;

  if (!checkPlaceIsUpToDate(updatedPlace)) {
    updatedPlace = (await updateGooglePlaceData(updatedPlace)) || updatedPlace;
    updatedPlace = (await updateOsmPlaceData(updatedPlace)) || updatedPlace;
  }

  return {
    place: updatedPlace,
    userSubmissions: userSubmissions || [],
    likes: likes || []
  };
}
