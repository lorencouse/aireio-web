export type City = {
  id: string;
  name: string;
  google_id: string;
  osm_id: string | null;
  lat: number;
  lng: number;
  state: string | null;
  state_code: string | null;
  country: string | null;
  country_code: string | null;
  photo_ref: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted: string | null;
};

export type Place = {
  id: string;
  google_id: string;
  osm_id: string | null;
  name: string;
  lat: number;
  lng: number;
  type: string;
  check_date: string | null;
  photo_refs: string[] | null;
  photo_names: string[] | null;
  // address
  add_1: string | null;
  add_2: string | null;
  level: string | null;
  district: string | null;
  city: string | null;
  city_id: string | null;
  county: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  country_code: string | null;
  formatted_address: string | null;
  // contact info
  phone: string | null;
  facebook: string | null;
  instagram: string | null;
  mastodon: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  email: string | null;
  website: string | null;
  google_maps: string | null;
  // rating
  rating_score: number | null;
  rating_count: number | null;
  // amenities
  internet_access: boolean | null;
  internet_access_fee: boolean | null;
  dine_in: boolean | null;
  outdoor_seating: boolean | null;
  indoor_seating: boolean | null;
  takeaway: boolean | null;
  toilet: boolean | null;
  power_outlets: boolean | null;
  wheelchair_accessible: boolean | null;
  parking: boolean | null;
  parking_fee: boolean | null;
  serves_beer: boolean | null;
  serves_breakfast: boolean | null;
  serves_brunch: boolean | null;
  serves_dinner: boolean | null;
  serves_lunch: boolean | null;
  serves_vegetarian_food: boolean | null;
  serves_vegan_food: boolean | null;
  serves_wine: boolean | null;

  brand: string | null;
  brand_wikidata: string | null;
  cost_coffee: string | null;
  description: string | null;
  note: string | null;
  opening_hours: string[] | null;
  price_level: number | null;
  deleted: string | null;
};

export type UserSubmittedPlaceDetails = {
  id: string;
  place_id: string;
  user_id: string;
  updated: string;
  // contact info
  phone: string | null;
  facebook: string | null;
  instagram: string | null;
  mastodon: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  email: string | null;
  website: string | null;

  // amenities
  internet_access: boolean | null;
  internet_access_fee: boolean | null;
  internet_name: string | null;
  internet_password: string | null;
  dine_in: boolean | null;
  outdoor_seating: boolean | null;
  indoor_seating: boolean | null;
  takeaway: boolean | null;
  toilet: boolean | null;
  toilet_code: string | null;
  power_outlets: boolean | null;
  wheelchair_accessible: boolean | null;
  parking: boolean | null;
  parking_fee: boolean | null;
  serves_beer: boolean | null;
  serves_breakfast: boolean | null;
  serves_brunch: boolean | null;
  serves_dinner: boolean | null;
  serves_lunch: boolean | null;
  serves_vegetarian_food: boolean | null;
  serves_vegan_food: boolean | null;
  serves_wine: boolean | null;

  price_level: number | null;
  cost_coffee: number | null;
  bathroom_code: string | null;
  description: string | null;
  note: string | null;

  // rating
  rating_score: number | null;
  review: string | null;
  photos: string[] | null;
  favorited: string | null;
};

export interface FavoritedPlace {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export type UserProfile = {
  id: string;
  created_at: string | null;
  full_name: string | null;
  username: string | null;
  language: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  websites: string[] | null;
  dob: string | null;
  theme: string | null;
  favorites: string[] | null;
  current_city_id: string | null;
  avatar_url: string | null;
};

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
