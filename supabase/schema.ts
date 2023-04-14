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
      follows: {
        Row: {
          created_at: string | null
          following_id: number | null
          id: number
          status: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          following_id?: number | null
          id?: number
          status?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          following_id?: number | null
          id?: number
          status?: string | null
          user_id?: number | null
        }
      }
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
      multiplayer_sessions: {
        Row: {
          created_at: string | null
          id: number
          loser_xp_loss: number
          player1: string | null
          player2: string | null
          winner_xp_gains: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          loser_xp_loss: number
          player1?: string | null
          player2?: string | null
          winner_xp_gains: number
        }
        Update: {
          created_at?: string | null
          id?: number
          loser_xp_loss?: number
          player1?: string | null
          player2?: string | null
          winner_xp_gains?: number
        }
      }
      profile: {
        Row: {
          country: string | null
          created_at: string | null
          elo_rating: number
          first_name: string | null
          friends: string[] | null
          id: number
          last_name: string | null
          last_online: string | null
          level: number
          profile_picture: string | null
          status: string | null
          total_xp: number
          twitter_url: string | null
          user_id: string
          username: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          elo_rating?: number
          first_name?: string | null
          friends?: string[] | null
          id?: number
          last_name?: string | null
          last_online?: string | null
          level?: number
          profile_picture?: string | null
          status?: string | null
          total_xp?: number
          twitter_url?: string | null
          user_id: string
          username: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          elo_rating?: number
          first_name?: string | null
          friends?: string[] | null
          id?: number
          last_name?: string | null
          last_online?: string | null
          level?: number
          profile_picture?: string | null
          status?: string | null
          total_xp?: number
          twitter_url?: string | null
          user_id?: string
          username?: string
        }
      }
      selections: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: number
          name?: string | null
        }
      }
      sessions: {
        Row: {
          accuracy: number
          char_performance: Json | null
          consistency: number | null
          cpm: number
          created_at: string | null
          difficulty: string
          duration: number
          end_time: string
          game_metadata: Json | null
          id: number
          interval_performance: Json | null
          keystroke_logs: Json | null
          logs: Json[] | null
          mode: string | null
          multiplayer_id: number | null
          raw: number | null
          start_time: string
          total_characters: number
          total_corrects: number | null
          total_errors: number | null
          total_extras: number | null
          total_missed: number | null
          total_words: number | null
          user_id: number | null
          user_username: string | null
          word_performance: Json | null
          words: string[]
          wpm: number
          xp_gains: number | null
        }
        Insert: {
          accuracy: number
          char_performance?: Json | null
          consistency?: number | null
          cpm?: number
          created_at?: string | null
          difficulty?: string
          duration: number
          end_time: string
          game_metadata?: Json | null
          id?: number
          interval_performance?: Json | null
          keystroke_logs?: Json | null
          logs?: Json[] | null
          mode?: string | null
          multiplayer_id?: number | null
          raw?: number | null
          start_time: string
          total_characters?: number
          total_corrects?: number | null
          total_errors?: number | null
          total_extras?: number | null
          total_missed?: number | null
          total_words?: number | null
          user_id?: number | null
          user_username?: string | null
          word_performance?: Json | null
          words: string[]
          wpm: number
          xp_gains?: number | null
        }
        Update: {
          accuracy?: number
          char_performance?: Json | null
          consistency?: number | null
          cpm?: number
          created_at?: string | null
          difficulty?: string
          duration?: number
          end_time?: string
          game_metadata?: Json | null
          id?: number
          interval_performance?: Json | null
          keystroke_logs?: Json | null
          logs?: Json[] | null
          mode?: string | null
          multiplayer_id?: number | null
          raw?: number | null
          start_time?: string
          total_characters?: number
          total_corrects?: number | null
          total_errors?: number | null
          total_extras?: number | null
          total_missed?: number | null
          total_words?: number | null
          user_id?: number | null
          user_username?: string | null
          word_performance?: Json | null
          words?: string[]
          wpm?: number
          xp_gains?: number | null
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
