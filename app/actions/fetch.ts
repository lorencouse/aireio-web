'use server';
import { createClient } from '@/utils/supabase/server';
import { City } from '@/utils/types';
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
