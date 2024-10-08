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
      cities: {
        Row: {
          country: string | null
          country_code: string | null
          created_at: string | null
          deleted: boolean
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
          deleted?: boolean
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
          deleted?: boolean
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
      places: {
        Row: {
          add_1: string | null
          add_2: string | null
          brand: string | null
          brand_wikidata: string | null
          check_date: Date | null
          city: string | null
          city_id: string | null
          cost_coffee: string | null
          country: string | null
          country_code: string | null
          county: string | null
          deleted: boolean
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
          check_date?: Date | null
          city?: string | null
          city_id?: string | null
          cost_coffee?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          deleted?: boolean
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
          check_date?: Date | null
          city?: string | null
          city_id?: string | null
          cost_coffee?: string | null
          country?: string | null
          country_code?: string | null
          county?: string | null
          deleted?: boolean
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
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_submitted_place_details: {
        Row: {
          bathroom_code: string | null
          cost_coffee: number | null
          description: string | null
          dine_in: boolean | null
          email: string | null
          facebook: string | null
          id: string
          indoor_seating: boolean | null
          instagram: string | null
          internet_access: boolean | null
          internet_access_fee: boolean | null
          internet_name: string | null
          internet_password: string | null
          mastodon: string | null
          note: string | null
          outdoor_seating: boolean | null
          parking: boolean | null
          parking_fee: boolean | null
          phone: string | null
          photos: string[] | null
          place_id: string
          power_outlets: boolean | null
          price_level: number | null
          rating_score: number | null
          review: string | null
          serves_beer: boolean | null
          serves_breakfast: boolean | null
          serves_brunch: boolean | null
          serves_dinner: boolean | null
          serves_lunch: boolean | null
          serves_vegan_food: boolean | null
          serves_vegetarian_food: boolean | null
          serves_wine: boolean | null
          takeaway: boolean | null
          tiktok: string | null
          toilet: boolean | null
          toilet_code: string | null
          twitter: string | null
          updated: string
          user_id: string
          website: string | null
          wheelchair_accessible: boolean | null
          youtube: string | null
        }
        Insert: {
          bathroom_code?: string | null
          cost_coffee?: number | null
          description?: string | null
          dine_in?: boolean | null
          email?: string | null
          facebook?: string | null
          id?: string
          indoor_seating?: boolean | null
          instagram?: string | null
          internet_access?: boolean | null
          internet_access_fee?: boolean | null
          internet_name?: string | null
          internet_password?: string | null
          mastodon?: string | null
          note?: string | null
          outdoor_seating?: boolean | null
          parking?: boolean | null
          parking_fee?: boolean | null
          phone?: string | null
          photos?: string[] | null
          place_id: string
          power_outlets?: boolean | null
          price_level?: number | null
          rating_score?: number | null
          review?: string | null
          serves_beer?: boolean | null
          serves_breakfast?: boolean | null
          serves_brunch?: boolean | null
          serves_dinner?: boolean | null
          serves_lunch?: boolean | null
          serves_vegan_food?: boolean | null
          serves_vegetarian_food?: boolean | null
          serves_wine?: boolean | null
          takeaway?: boolean | null
          tiktok?: string | null
          toilet?: boolean | null
          toilet_code?: string | null
          twitter?: string | null
          updated: string
          user_id: string
          website?: string | null
          wheelchair_accessible?: boolean | null
          youtube?: string | null
        }
        Update: {
          bathroom_code?: string | null
          cost_coffee?: number | null
          description?: string | null
          dine_in?: boolean | null
          email?: string | null
          facebook?: string | null
          id?: string
          indoor_seating?: boolean | null
          instagram?: string | null
          internet_access?: boolean | null
          internet_access_fee?: boolean | null
          internet_name?: string | null
          internet_password?: string | null
          mastodon?: string | null
          note?: string | null
          outdoor_seating?: boolean | null
          parking?: boolean | null
          parking_fee?: boolean | null
          phone?: string | null
          photos?: string[] | null
          place_id?: string
          power_outlets?: boolean | null
          price_level?: number | null
          rating_score?: number | null
          review?: string | null
          serves_beer?: boolean | null
          serves_breakfast?: boolean | null
          serves_brunch?: boolean | null
          serves_dinner?: boolean | null
          serves_lunch?: boolean | null
          serves_vegan_food?: boolean | null
          serves_vegetarian_food?: boolean | null
          serves_wine?: boolean | null
          takeaway?: boolean | null
          tiktok?: string | null
          toilet?: boolean | null
          toilet_code?: string | null
          twitter?: string | null
          updated?: string
          user_id?: string
          website?: string | null
          wheelchair_accessible?: boolean | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_submitted_place_details_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_submitted_place_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
