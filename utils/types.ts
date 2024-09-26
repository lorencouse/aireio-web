export type City = {
  id: string;
  name: string;
  google_id: string;
  osm_id?: string;
  lat: number;
  lng: number;
  state?: string;
  state_code?: string;
  country?: string;
  country_code?: string;
  photo_ref?: string;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
}
 
export type Place = {
  id: string;
  google_id: string;
  oms_id?: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  check_date?: Date;
  // business_status?: string;
  photo_refs: string[];
  photo_names?: string[];
  // address
  add_1?: string;
  add_2?: string;
  level?: string;
  district?: string;
  city?: string;
  city_id?: string;
  county?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;
  formatted_address?: string;
  // contact info
  phone?: string;
  facebook?: string;
  instagram?: string;
  mastodon?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  email?: string;
  website?: string;
  google_maps?: string;
  // rating
  rating_score?: number;
  rating_count?: number;
  // amenities
  internet_access?: boolean;
  internet_access_fee?: boolean;
  dine_in?: boolean;
  outdoor_seating?: boolean;
  indoor_seating?: boolean;
  takeaway?: boolean;
  toilet?: boolean;
  power_outlets?: boolean;
  wheelchair_accessible?: boolean;
  parking?: boolean;
  parking_fee?: boolean;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_vegan_food?: boolean;
  serves_wine?: boolean;

  brand?: string;
  brand_wikidata?: string;
  cost_coffee?: string;
  description?: string;
  note?: string;
  opening_hours?: string[];
  price_level?: number;
  deleted: boolean;
}

export type UserSubmittedPlaceDetails = {
  id: string;
  place_id: string;
  user_id: string;
  updated: Date;
  // contact info
  phone?: string;
  facebook?: string;
  instagram?: string;
  mastodon?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  email?: string;
  website?: string;

  // amenities
  internet_access?: boolean;
  internet_access_fee?: boolean;
  internet_name?: string;
  internet_password?: string;
  dine_in?: boolean;
  outdoor_seating?: boolean;
  indoor_seating?: boolean;
  takeaway?: boolean;
  toilet?: boolean;
  toilet_code?: string;
  power_outlets?: boolean;
  wheelchair_accessible?: boolean;
  parking?: boolean;
  parking_fee?: boolean;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_vegan_food?: boolean;
  serves_wine?: boolean;

  price_level?: number;
  cost_coffee?: number;
  internet_password?: string;
  bathroom_code?: string;
  description?: string;
  note?: string;

  // rating
  rating_score?: number;
  review?: string;
  photos?: string[];
}

export type UserProfile = {
  id: string;
  created_at: Date;
  full_name?: string;
  username?: string;
  language?: string;
  email?: string;
  phone?: string;
  bio?: string;
  websites?: string[];
  dob?: Date;
  theme?: string;
  favorites?: string[];
  current_city_id?: string;
  avatar_url?: string;
}

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
}
