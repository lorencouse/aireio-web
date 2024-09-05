export interface City {
  id: string;
  google_id: string;
  osm_id?: string;
  name: string;
  lat: number;
  lng: number;
  state?: string;
  country?: string;
  country_code?: string;
  cafe_ids?: string[];
  library_ids?: string[];
  coworking_space_ids?: string[];
  google_place_ids?: string[];
  blacklist_google_ids?: string[];
  photo_ref?: string;
}

export interface UserProfile {
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
export interface Place {
  id: string;
  google_place_id: string;
  oms_place_id?: string;
  name: string;
  lat: number;
  lng: number;
  type: 'cafe' | 'library' | 'coworking';
  check_date?: Date;
  business_status?: string;

  photos?: {
    ref?: string;
    url?: string;
  }[];
  address: {
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
  };
  contact: {
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
  };
  amenities: {
    internet_access?: 'yes' | 'no' | 'wlan';
    internet_access_fee?: string;
    dine_in?: boolean;
    outdoor_seating?: string;
    indoor_seating?: string;
    takeaway?: 'only' | 'yes' | 'no';
    toilet?: string;
    power_outlets?: string;
    wheelchair_accessible?: 'limited' | 'yes' | 'no';
    parking?: string;
    parking_fee?: string;
    serves_beer?: boolean;
    serves_breakfast?: boolean;
    serves_brunch?: boolean;
    serves_dinner?: boolean;
    serves_lunch?: boolean;
    serves_vegetarian_food?: boolean;
    serves_vegan_food?: boolean;
    serves_wine?: boolean;
  };
  tags: {
    brand?: string;
    brand_wikidata?: string;
    open_now?: boolean;
    cost_coffee?: string;
    description?: string;
    note?: string;
    opening_hours?: string;
    cost?: 0 | 1 | 2 | 3 | 4 | 5;
  };
  google_rating: {
    score?: number;
    count?: number;
  };
}

export interface GooglePlace {
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
