'use server';
import { createClient } from '@/utils/supabase/server';
import { UserContributionJoined, City } from '@/utils/types';
import { Database } from '@/types_db';

export async function getAllCities(limit: number): Promise<City[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .limit(limit);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}
export async function getCitiesForState(
  country: string,
  state: string
): Promise<City[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('state', state)
    .eq('country_code', country)
    .limit(24);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}
export async function getCitiesForCountry(country: string): Promise<City[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_code', country)
    .limit(24);

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

export async function getCitiesById(cityIds: string[]): Promise<City[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .in('id', cityIds);
  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
  return data || [];
}

type CountryResult =
  Database['public']['Functions']['get_unique_countries']['Returns'][number];

export async function getCountries(): Promise<CountryResult[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_unique_countries');

  if (error) {
    console.error('Error fetching countries:', error);
    return [];
  }

  return data || [];
}

export async function getUserContributions(): Promise<
  UserContributionJoined[]
> {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      console.log('Authentication error', userError);
      return [];
    }

    if (!user?.id) {
      console.log('No authenticated user found');
      return [];
    }

    // Using a flattened select with explicit fields
    const { data, error: contributionsError } = await supabase
      .from('amenity_submissions')
      .select(
        `
      id,
      user_id,
      place_id,
      amenity_name,
      value,
      timestamp,
      places(name, country_code, state, city)
      `
      )
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (contributionsError) {
      console.log('Error fetching user contributions:', contributionsError);
      return [];
    }

    return (data as UserContributionJoined[]) || [];
  } catch (error) {
    console.error('Error in getUserContributions:', error);
    return [];
  }
}

export async function getCoinCount({
  userId
}: {
  userId: string;
}): Promise<number> {
  if (!userId) {
    return 0;
  }
  const supabase = createClient();

  const { count, error } = await supabase
    .from('amenity_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching coin count:', error.message);
    return 0;
  }

  return count ?? 0;
}
