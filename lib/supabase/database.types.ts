export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_demo_character_private_configs: {
        Row: {
          character_id: string
          created_at: string
          secret_context: string
          updated_at: string
        }
        Insert: {
          character_id: string
          created_at?: string
          secret_context?: string
          updated_at?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          secret_context?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_demo_character_private_configs_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "ai_demo_characters"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_demo_characters: {
        Row: {
          banner_image_id: string | null
          banner_image_url: string | null
          category: string
          created_at: string
          creator_id: string
          description: string
          gender: string
          id: string
          image_gradient: string
          image_id: string | null
          image_url: string | null
          name: string
          opening_message: string
          role: string
          sample_messages: string[]
          seed_chat: string[]
          status_message: string | null
          tags: string[]
          total_chat_count: number
          world_view: string
        }
        Insert: {
          banner_image_id?: string | null
          banner_image_url?: string | null
          category?: string
          created_at?: string
          creator_id?: string
          description: string
          gender?: string
          id?: string
          image_gradient: string
          image_id?: string | null
          image_url?: string | null
          name: string
          opening_message: string
          role: string
          sample_messages?: string[]
          seed_chat?: string[]
          status_message?: string | null
          tags?: string[]
          total_chat_count?: number
          world_view: string
        }
        Update: {
          banner_image_id?: string | null
          banner_image_url?: string | null
          category?: string
          created_at?: string
          creator_id?: string
          description?: string
          gender?: string
          id?: string
          image_gradient?: string
          image_id?: string | null
          image_url?: string | null
          name?: string
          opening_message?: string
          role?: string
          sample_messages?: string[]
          seed_chat?: string[]
          status_message?: string | null
          tags?: string[]
          total_chat_count?: number
          world_view?: string
        }
        Relationships: []
      }
      ai_demo_chat_messages: {
        Row: {
          character_id: string
          content: string
          created_at: string
          id: string
          role: string
          room_id: string
        }
        Insert: {
          character_id: string
          content: string
          created_at?: string
          id?: string
          role: string
          room_id: string
        }
        Update: {
          character_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_demo_chat_messages_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "ai_demo_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_demo_chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "ai_demo_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_demo_chat_rooms: {
        Row: {
          character_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          character_id: string
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_demo_chat_rooms_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "ai_demo_characters"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_demo_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          new_owner_id: string
          payload: Json
          previous_owner_id: string | null
          transaction_id: string
          work_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          new_owner_id: string
          payload?: Json
          previous_owner_id?: string | null
          transaction_id: string
          work_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          new_owner_id?: string
          payload?: Json
          previous_owner_id?: string | null
          transaction_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_demo_events_new_owner_id_fkey"
            columns: ["new_owner_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_demo_events_previous_owner_id_fkey"
            columns: ["previous_owner_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_demo_events_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_works"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_demo_offers: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          work_id: string
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          work_id: string
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_demo_offers_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_demo_offers_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_works"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_demo_users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          handle: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          handle: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          handle?: string
          id?: string
        }
        Relationships: []
      }
      marketplace_demo_works: {
        Row: {
          asking_price: number | null
          created_at: string
          creator_id: string
          description: string
          height: number
          id: string
          image_id: string | null
          image_url: string
          last_sale_price: number | null
          listing_status: string
          offer_count: number
          owner_id: string
          ownership_status: string
          tags: string[]
          title: string
          updated_at: string
          usage_rights: Json
          width: number
        }
        Insert: {
          asking_price?: number | null
          created_at?: string
          creator_id: string
          description?: string
          height?: number
          id: string
          image_id?: string | null
          image_url: string
          last_sale_price?: number | null
          listing_status: string
          offer_count?: number
          owner_id: string
          ownership_status: string
          tags?: string[]
          title: string
          updated_at?: string
          usage_rights?: Json
          width?: number
        }
        Update: {
          asking_price?: number | null
          created_at?: string
          creator_id?: string
          description?: string
          height?: number
          id?: string
          image_id?: string | null
          image_url?: string
          last_sale_price?: number | null
          listing_status?: string
          offer_count?: number
          owner_id?: string
          ownership_status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          usage_rights?: Json
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_demo_works_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_demo_works_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "marketplace_demo_users"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
