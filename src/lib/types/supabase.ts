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
      activity: {
        Row: {
          created_at: string
          date: string
          id: number
          workout_id: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: number
          workout_id: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          workout_id?: number
        }
        Relationships: []
      }
      project_images: {
        Row: {
          id: number
          image_url: string
          project_id: number
        }
        Insert: {
          id?: number
          image_url: string
          project_id: number
        }
        Update: {
          id?: number
          image_url?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_skills: {
        Row: {
          project_id: number
          skills_id: number
        }
        Insert: {
          project_id: number
          skills_id: number
        }
        Update: {
          project_id?: number
          skills_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skills_id_fkey"
            columns: ["skills_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          project_id: number
          team_member_id: number
        }
        Insert: {
          project_id?: number
          team_member_id?: number
        }
        Update: {
          project_id?: number
          team_member_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          description: string
          id: number
          link: string
          name: string
          start_date: string
        }
        Insert: {
          description: string
          id?: number
          link: string
          name: string
          start_date: string
        }
        Update: {
          description?: string
          id?: number
          link?: string
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          color: string | null
          id: number
          level: string
          name: string
          sub_type: string | null
          type: string
        }
        Insert: {
          color?: string | null
          id?: number
          level: string
          name: string
          sub_type?: string | null
          type: string
        }
        Update: {
          color?: string | null
          id?: number
          level?: string
          name?: string
          sub_type?: string | null
          type?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          github_link: string
          id: number
          image_url: string
          name: string
        }
        Insert: {
          github_link: string
          id?: number
          image_url: string
          name: string
        }
        Update: {
          github_link?: string
          id?: number
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string
          company_logo_url: string
          content: string
          description: string
          email: string
          image_url: string
          name: string
          quote: string
          received_at: string
          slug: string
        }
        Insert: {
          company: string
          company_logo_url: string
          content: string
          description: string
          email: string
          image_url: string
          name: string
          quote: string
          received_at: string
          slug: string
        }
        Update: {
          company?: string
          company_logo_url?: string
          content?: string
          description?: string
          email?: string
          image_url?: string
          name?: string
          quote?: string
          received_at?: string
          slug?: string
        }
        Relationships: []
      }
      workout: {
        Row: {
          created_at: string
          duration: number
          id: number
          intensity: number
          title: string
          type: string | null
          url: string
          videoId: string
        }
        Insert: {
          created_at?: string
          duration: number
          id?: number
          intensity: number
          title: string
          type?: string | null
          url: string
          videoId: string
        }
        Update: {
          created_at?: string
          duration?: number
          id?: number
          intensity?: number
          title?: string
          type?: string | null
          url?: string
          videoId?: string
        }
        Relationships: []
      }
      workout_activity: {
        Row: {
          created_at: string
          date: string
          id: number
          workout_id: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: number
          workout_id: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_activity_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout"
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

