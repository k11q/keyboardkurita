export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: number
          last_name: string | null
          profile_picture: string | null
          twitter_url: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          profile_picture?: string | null
          twitter_url?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          profile_picture?: string | null
          twitter_url?: string | null
          user_id?: string
          username?: string
        }
      }
      sessions: {
        Row: {
          created_at: string | null
          duration: number
          end_time: string
          id: number
          logs: Json[]
          start_time: string
          user_id: string
          words: string[]
        }
        Insert: {
          created_at?: string | null
          duration: number
          end_time: string
          id?: number
          logs: Json[]
          start_time: string
          user_id: string
          words: string[]
        }
        Update: {
          created_at?: string | null
          duration?: number
          end_time?: string
          id?: number
          logs?: Json[]
          start_time?: string
          user_id?: string
          words?: string[]
        }
      }
      subwords: {
        Row: {
          created_at: string | null
          id: number
          length: number
          subword: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          length: number
          subword: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: number
          length?: number
          subword?: string
          type?: string
        }
      }
      words: {
        Row: {
          count: number
          created_at: string | null
          id: number
          length: number
          word: string
        }
        Insert: {
          count: number
          created_at?: string | null
          id?: number
          length: number
          word: string
        }
        Update: {
          count?: number
          created_at?: string | null
          id?: number
          length?: number
          word?: string
        }
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
