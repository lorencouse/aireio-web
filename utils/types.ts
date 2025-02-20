import { Database } from '@/types_db';

export type City = Database['public']['Tables']['cities']['Row'];

export type Place = Database['public']['Tables']['places']['Row'];

export type UserContribution =
  Database['public']['Tables']['amenity_submissions']['Row'];

export type UserContributionJoined = {
  id: string;
  user_id: string | null;
  place_id: string | null;
  amenity_name: string | null;
  value: string;
  timestamp: string | null;
  places: {
    name: string;
    country_code: string;
    state: string | null;
    city: string | null;
  };
};

export type AmenityAggregation =
  Database['public']['Tables']['amenity_aggregations']['Row'];

export type Favorite = Database['public']['Tables']['favorites']['Row'];

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export type PlaceLike = Database['public']['Tables']['place_likes']['Row'];

export type GooglePlace = {
  business_status: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }[];
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  price_level?: number;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
};
