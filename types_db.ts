export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amenity_aggregations: {
        Row: {
          amenity_name: string
          last_updated: string | null
          place_id: string
          submission_count: number | null
          value_distribution: Json | null
        }
        Insert: {
          amenity_name: string
          last_updated?: string | null
          place_id: string
          submission_count?: number | null
          value_distribution?: Json | null
        }
        Update: {
          amenity_name?: string
          last_updated?: string | null
          place_id?: string
          submission_count?: number | null
          value_distribution?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "amenity_aggregations_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      amenity_submissions: {
        Row: {
          amenity_name: string | null
          id: string
          place_id: string | null
          timestamp: string | null
          user_id: string | null
          value: string
        }
        Insert: {
          amenity_name?: string | null
          id?: string
          place_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          value: string
        }
        Update: {
          amenity_name?: string | null
          id?: string
          place_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "amenity_submissions_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string | null
          country_code: string | null
          created_at: string | null
          deleted: string | null
          google_id: string
          id: string
          lat: number
          lng: number
          name: string
          osm_id: string | null
          photo_ref: string | null
          state: string | null
          state_code: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          deleted?: string | null
          google_id: string
          id?: string
          lat: number
          lng: number
          name: string
          osm_id?: string | null
          photo_ref?: string | null
          state?: string | null
          state_code?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          deleted?: string | null
          google_id?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          osm_id?: string | null
          photo_ref?: string | null
          state?: string | null
          state_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          place_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          place_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          place_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_likes: {
        Row: {
          created_at: string | null
          id: number
          is_like: boolean
          place_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_like: boolean
          place_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_like?: boolean
          place_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_likes_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          add_1: string | null
          add_2: string | null
          brand: string | null
          brand_wikidata: string | null
          check_date: string | null
          city: string | null
          city_id: string | null
          cost_coffee: string | null
          country: string | null
          country_code: string | null
          county: string | null
          deleted: string | null
          description: string | null
          dine_in: boolean | null
          district: string | null
          email: string | null
          facebook: string | null
          formatted_address: string | null
          google_id: string
          google_maps: string | null
          id: string
          indoor_seating: boolean | null
          instagram: string | null
          internet_access: boolean | null
          internet_access_fee: boolean | null
          lat: number
          level: string | null
          lng: number
          mastodon: string | null
          name: string
          note: string | null
          opening_hours: string[] | null
          osm_id: string | null
          outdoor_seating: boolean | null
          parking: boolean | null
          parking_fee: boolean | null
          phone: string | null
          photo_names: string[] | null
          photo_refs: string[] | null
          postal_code: string | null
          power_outlets: boolean | null
          price_level: number | null
          rating_count: number | null
          rating_score: number | null
          serves_beer: boolean | null
          serves_breakfast: boolean | null
          serves_brunch: boolean | null
          serves_dinner: boolean | null
          serves_lunch: boolean | null
          serves_vegan_food: boolean | null
          serves_vegetarian_food: boolean | null
          serves_wine: boolean | null
          state: string | null
          takeaway: boolean | null
          tiktok: string | null
          toilet: boolean | null
          twitter: string | null
          type: string
          website: string | null
          wheelchair_accessible: boolean | null
          youtube: string | null
        }
        Insert: {
          add_1?: string | null
          add_2?: string | null
          brand?: string | null
          brand_wikidata?: string | null
          check_date?: string | null
          city?: string | null
          city_id?: string | null
          cost_coffee?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          deleted?: string | null
          description?: string | null
          dine_in?: boolean | null
          district?: string | null
          email?: string | null
          facebook?: string | null
          formatted_address?: string | null
          google_id: string
          google_maps?: string | null
          id?: string
          indoor_seating?: boolean | null
          instagram?: string | null
          internet_access?: boolean | null
          internet_access_fee?: boolean | null
          lat: number
          level?: string | null
          lng: number
          mastodon?: string | null
          name: string
          note?: string | null
          opening_hours?: string[] | null
          osm_id?: string | null
          outdoor_seating?: boolean | null
          parking?: boolean | null
          parking_fee?: boolean | null
          phone?: string | null
          photo_names?: string[] | null
          photo_refs?: string[] | null
          postal_code?: string | null
          power_outlets?: boolean | null
          price_level?: number | null
          rating_count?: number | null
          rating_score?: number | null
          serves_beer?: boolean | null
          serves_breakfast?: boolean | null
          serves_brunch?: boolean | null
          serves_dinner?: boolean | null
          serves_lunch?: boolean | null
          serves_vegan_food?: boolean | null
          serves_vegetarian_food?: boolean | null
          serves_wine?: boolean | null
          state?: string | null
          takeaway?: boolean | null
          tiktok?: string | null
          toilet?: boolean | null
          twitter?: string | null
          type: string
          website?: string | null
          wheelchair_accessible?: boolean | null
          youtube?: string | null
        }
        Update: {
          add_1?: string | null
          add_2?: string | null
          brand?: string | null
          brand_wikidata?: string | null
          check_date?: string | null
          city?: string | null
          city_id?: string | null
          cost_coffee?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          deleted?: string | null
          description?: string | null
          dine_in?: boolean | null
          district?: string | null
          email?: string | null
          facebook?: string | null
          formatted_address?: string | null
          google_id?: string
          google_maps?: string | null
          id?: string
          indoor_seating?: boolean | null
          instagram?: string | null
          internet_access?: boolean | null
          internet_access_fee?: boolean | null
          lat?: number
          level?: string | null
          lng?: number
          mastodon?: string | null
          name?: string
          note?: string | null
          opening_hours?: string[] | null
          osm_id?: string | null
          outdoor_seating?: boolean | null
          parking?: boolean | null
          parking_fee?: boolean | null
          phone?: string | null
          photo_names?: string[] | null
          photo_refs?: string[] | null
          postal_code?: string | null
          power_outlets?: boolean | null
          price_level?: number | null
          rating_count?: number | null
          rating_score?: number | null
          serves_beer?: boolean | null
          serves_breakfast?: boolean | null
          serves_brunch?: boolean | null
          serves_dinner?: boolean | null
          serves_lunch?: boolean | null
          serves_vegan_food?: boolean | null
          serves_vegetarian_food?: boolean | null
          serves_wine?: boolean | null
          state?: string | null
          takeaway?: boolean | null
          tiktok?: string | null
          toilet?: boolean | null
          twitter?: string | null
          type?: string
          website?: string | null
          wheelchair_accessible?: boolean | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_city_id: string | null
          dob: string | null
          email: string | null
          favorites: string[] | null
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          theme: string | null
          username: string | null
          websites: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_city_id?: string | null
          dob?: string | null
          email?: string | null
          favorites?: string[] | null
          full_name?: string | null
          id: string
          language?: string | null
          phone?: string | null
          theme?: string | null
          username?: string | null
          websites?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_city_id?: string | null
          dob?: string | null
          email?: string | null
          favorites?: string[] | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          theme?: string | null
          username?: string | null
          websites?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      format_country_name: {
        Args: {
          name: string
        }
        Returns: string
      }
      get_unique_countries: {
        Args: Record<PropertyKey, never>
        Returns: {
          country: string
          country_code: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
