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
      cover_letter_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_cover_letters: {
        Row: {
          company_address: string | null
          company_name: string
          content: string
          created_at: string | null
          id: string
          job_title: string
          recipient_name: string | null
          recipient_title: string | null
          template_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_name: string
          content: string
          created_at?: string | null
          id?: string
          job_title: string
          recipient_name?: string | null
          recipient_title?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_name?: string
          content?: string
          created_at?: string | null
          id?: string
          job_title?: string
          recipient_name?: string | null
          recipient_title?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_cover_letters_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cover_letter_templates"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          professional_summary: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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