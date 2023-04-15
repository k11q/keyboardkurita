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
      character_performance: {
        Row: {
          character: string
          corrects: number
          count: number
          created_at: string | null
          errors: number
          id: number
          session_id: number
          wpm: number
        }
        Insert: {
          character: string
          corrects: number
          count: number
          created_at?: string | null
          errors: number
          id?: number
          session_id: number
          wpm: number
        }
        Update: {
          character?: string
          corrects?: number
          count?: number
          created_at?: string | null
          errors?: number
          id?: number
          session_id?: number
          wpm?: number
        }
      }
      characters: {
        Row: {
          char_index: number | null
          character: string | null
          created_at: string | null
          id: number
          status: string | null
          timing: string | null
          word_id: number | null
          word_index: number | null
        }
        Insert: {
          char_index?: number | null
          character?: string | null
          created_at?: string | null
          id?: number
          status?: string | null
          timing?: string | null
          word_id?: number | null
          word_index?: number | null
        }
        Update: {
          char_index?: number | null
          character?: string | null
          created_at?: string | null
          id?: number
          status?: string | null
          timing?: string | null
          word_id?: number | null
          word_index?: number | null
        }
      }
      datasets: {
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
      interval_logs: {
        Row: {
          character_index: number
          created_at: string | null
          errors: number
          id: number
          raw: number
          second: number
          session_id: number
          time: string
          word_index: number
          wpm: number
        }
        Insert: {
          character_index: number
          created_at?: string | null
          errors: number
          id?: number
          raw: number
          second: number
          session_id: number
          time: string
          word_index: number
          wpm: number
        }
        Update: {
          character_index?: number
          created_at?: string | null
          errors?: number
          id?: number
          raw?: number
          second?: number
          session_id?: number
          time?: string
          word_index?: number
          wpm?: number
        }
      }
      keystroke_logs: {
        Row: {
          character_index: number
          correct_character_index: number
          created_at: string | null
          id: number
          key: string
          session_id: number
          status: string
          time: string
          word_index: number
        }
        Insert: {
          character_index: number
          correct_character_index: number
          created_at?: string | null
          id?: number
          key: string
          session_id: number
          status?: string
          time: string
          word_index: number
        }
        Update: {
          character_index?: number
          correct_character_index?: number
          created_at?: string | null
          id?: number
          key?: string
          session_id?: number
          status?: string
          time?: string
          word_index?: number
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
      personal_best: {
        Row: {
          created_at: string | null
          id: number
          session_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          session_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          session_id?: number
          user_id?: number
        }
      }
      profile: {
        Row: {
          banned: boolean
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
          status: string
          streak: number
          total_xp: number
          twitter_username: string | null
          user_id: string
          username: string
        }
        Insert: {
          banned?: boolean
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
          status?: string
          streak?: number
          total_xp?: number
          twitter_username?: string | null
          user_id: string
          username: string
        }
        Update: {
          banned?: boolean
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
          status?: string
          streak?: number
          total_xp?: number
          twitter_username?: string | null
          user_id?: string
          username?: string
        }
      }
      public_stats: {
        Row: {
          created_at: string | null
          id: number
          sessions_completed: number
          sessions_started: number
          time_typing: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          sessions_completed?: number
          sessions_started?: number
          time_typing?: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          sessions_completed?: number
          sessions_started?: number
          time_typing?: number
          user_id?: number
        }
      }
      sessions: {
        Row: {
          accuracy: number
          chart_data: Json | null
          consistency: number
          created_at: string | null
          dataset: string
          difficulty: string
          duration: number
          end_time: string
          game_metadata: Json | null
          id: number
          logs: Json[] | null
          mode: string
          numbers: boolean
          punctuation: boolean
          raw: number
          restart_count: number
          start_time: string
          total_characters: number
          total_corrects: number
          total_errors: number
          total_extras: number
          total_missed: number
          total_words: number | null
          user_id: number
          user_username: string | null
          words: string[]
          wpm: number
          xp_gains: number
        }
        Insert: {
          accuracy: number
          chart_data?: Json | null
          consistency: number
          created_at?: string | null
          dataset?: string
          difficulty?: string
          duration: number
          end_time: string
          game_metadata?: Json | null
          id?: number
          logs?: Json[] | null
          mode?: string
          numbers?: boolean
          punctuation?: boolean
          raw: number
          restart_count?: number
          start_time: string
          total_characters?: number
          total_corrects: number
          total_errors?: number
          total_extras?: number
          total_missed?: number
          total_words?: number | null
          user_id: number
          user_username?: string | null
          words: string[]
          wpm: number
          xp_gains?: number
        }
        Update: {
          accuracy?: number
          chart_data?: Json | null
          consistency?: number
          created_at?: string | null
          dataset?: string
          difficulty?: string
          duration?: number
          end_time?: string
          game_metadata?: Json | null
          id?: number
          logs?: Json[] | null
          mode?: string
          numbers?: boolean
          punctuation?: boolean
          raw?: number
          restart_count?: number
          start_time?: string
          total_characters?: number
          total_corrects?: number
          total_errors?: number
          total_extras?: number
          total_missed?: number
          total_words?: number | null
          user_id?: number
          user_username?: string | null
          words?: string[]
          wpm?: number
          xp_gains?: number
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
      word_performance: {
        Row: {
          created_at: string | null
          id: number
          session_id: number
          status: string
          word: string
          wpm: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          session_id: number
          status: string
          word: string
          wpm: number
        }
        Update: {
          created_at?: string | null
          id?: number
          session_id?: number
          status?: string
          word?: string
          wpm?: number
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
