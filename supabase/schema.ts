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
      games: {
        Row: {
          created_at: string | null
          id: number
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          type?: string
        }
      }
      profile: {
        Row: {
          country: string | null
          created_at: string | null
          first_name: string | null
          friends: string[] | null
          id: number
          last_name: string | null
          last_online: string | null
          profile_picture: string | null
          status: string | null
          twitter_url: string | null
          user_id: string
          username: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          friends?: string[] | null
          id?: number
          last_name?: string | null
          last_online?: string | null
          profile_picture?: string | null
          status?: string | null
          twitter_url?: string | null
          user_id: string
          username: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          friends?: string[] | null
          id?: number
          last_name?: string | null
          last_online?: string | null
          profile_picture?: string | null
          status?: string | null
          twitter_url?: string | null
          user_id?: string
          username?: string
        }
      }
      sessions: {
        Row: {
          accuracy: number
          characters_per_minute: number
          consistency: number | null
          created_at: string | null
          difficulty: string
          duration: number
          end_time: string
          id: number
          logs: Json[]
          mode: string | null
          raw: number | null
          start_time: string
          total_characters: number
          total_corrects: number | null
          total_errors: number | null
          total_extras: number | null
          total_missed: number | null
          user_id: string
          words: string[]
          words_per_minute: number
        }
        Insert: {
          accuracy: number
          characters_per_minute?: number
          consistency?: number | null
          created_at?: string | null
          difficulty?: string
          duration: number
          end_time: string
          id?: number
          logs: Json[]
          mode?: string | null
          raw?: number | null
          start_time: string
          total_characters?: number
          total_corrects?: number | null
          total_errors?: number | null
          total_extras?: number | null
          total_missed?: number | null
          user_id: string
          words: string[]
          words_per_minute: number
        }
        Update: {
          accuracy?: number
          characters_per_minute?: number
          consistency?: number | null
          created_at?: string | null
          difficulty?: string
          duration?: number
          end_time?: string
          id?: number
          logs?: Json[]
          mode?: string | null
          raw?: number | null
          start_time?: string
          total_characters?: number
          total_corrects?: number | null
          total_errors?: number | null
          total_extras?: number | null
          total_missed?: number | null
          user_id?: string
          words?: string[]
          words_per_minute?: number
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
