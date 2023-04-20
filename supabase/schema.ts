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
      character_logs: {
        Row: {
          character: string
          created_at: string | null
          duration: number
          end_time: string
          id: number
          index: number
          session_id: number
          start_time: string
          status: string
          word_index: number
          wpm: number | null
        }
        Insert: {
          character: string
          created_at?: string | null
          duration: number
          end_time: string
          id?: number
          index: number
          session_id: number
          start_time: string
          status: string
          word_index: number
          wpm?: number | null
        }
        Update: {
          character?: string
          created_at?: string | null
          duration?: number
          end_time?: string
          id?: number
          index?: number
          session_id?: number
          start_time?: string
          status?: string
          word_index?: number
          wpm?: number | null
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
          log_time: string
          misses: number | null
          raw: number
          session_id: number
          time_from_start: number
          word_index: number
          wpm: number
        }
        Insert: {
          character_index: number
          created_at?: string | null
          errors: number
          id?: number
          log_time: string
          misses?: number | null
          raw: number
          session_id: number
          time_from_start: number
          word_index: number
          wpm: number
        }
        Update: {
          character_index?: number
          created_at?: string | null
          errors?: number
          id?: number
          log_time?: string
          misses?: number | null
          raw?: number
          session_id?: number
          time_from_start?: number
          word_index?: number
          wpm?: number
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
          words?: string[]
          wpm?: number
          xp_gains?: number
        }
      }
      word_logs: {
        Row: {
          created_at: string | null
          duration: number
          end_time: string
          id: number
          index: number
          session_id: number
          start_time: string
          status: string
          type: string
          word: string
          wpm: number
        }
        Insert: {
          created_at?: string | null
          duration: number
          end_time: string
          id?: number
          index: number
          session_id: number
          start_time: string
          status: string
          type: string
          word: string
          wpm: number
        }
        Update: {
          created_at?: string | null
          duration?: number
          end_time?: string
          id?: number
          index?: number
          session_id?: number
          start_time?: string
          status?: string
          type?: string
          word?: string
          wpm?: number
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          accuracy: number | null
          consistency: number | null
          end_time: string | null
          id: number | null
          raw: number | null
          status: string | null
          user_id: number | null
          username: string | null
          wpm: number | null
        }
      }
      sessions_with_profile: {
        Row: {
          accuracy: number | null
          chart_data: Json | null
          consistency: number | null
          created_at: string | null
          dataset: string | null
          difficulty: string | null
          duration: number | null
          end_time: string | null
          game_metadata: Json | null
          id: number | null
          logs: Json[] | null
          mode: string | null
          numbers: boolean | null
          punctuation: boolean | null
          raw: number | null
          restart_count: number | null
          start_time: string | null
          status: string | null
          total_characters: number | null
          total_corrects: number | null
          total_errors: number | null
          total_extras: number | null
          total_missed: number | null
          total_words: number | null
          user_id: number | null
          username: string | null
          words: string[] | null
          wpm: number | null
          xp_gains: number | null
        }
      }
      stats: {
        Row: {
          total_duration: number | null
          total_sessions: number | null
          total_users: number | null
        }
      }
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
