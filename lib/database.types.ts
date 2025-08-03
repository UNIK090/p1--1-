export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          timezone: string
          language: string
          created_at: string
          updated_at: string
          total_watch_time: number
          current_streak: number
          longest_streak: number
          weekly_goal: number
          daily_goal: number
          xp_points: number
          level: number
          notifications_enabled: boolean
          daily_reminders: boolean
          weekly_reports: boolean
          achievement_alerts: boolean
          streak_reminders: boolean
          email_notifications: boolean
          theme: string
          accent_color: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          total_watch_time?: number
          current_streak?: number
          longest_streak?: number
          weekly_goal?: number
          daily_goal?: number
          xp_points?: number
          level?: number
          notifications_enabled?: boolean
          daily_reminders?: boolean
          weekly_reports?: boolean
          achievement_alerts?: boolean
          streak_reminders?: boolean
          email_notifications?: boolean
          theme?: string
          accent_color?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          total_watch_time?: number
          current_streak?: number
          longest_streak?: number
          weekly_goal?: number
          daily_goal?: number
          xp_points?: number
          level?: number
          notifications_enabled?: boolean
          daily_reminders?: boolean
          weekly_reports?: boolean
          achievement_alerts?: boolean
          streak_reminders?: boolean
          email_notifications?: boolean
          theme?: string
          accent_color?: string
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string
          color: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          icon: string
          color: string
          position?: number
        }
        Update: {
          name?: string
          description?: string | null
          icon?: string
          color?: string
          position?: number
        }
      }
      playlists: {
        Row: {
          id: string
          folder_id: string
          youtube_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          channel_title: string | null
          channel_id: string | null
          video_count: number
          total_duration: number
          url: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          folder_id: string
          youtube_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          channel_title?: string | null
          channel_id?: string | null
          video_count?: number
          total_duration?: number
          url: string
          position?: number
        }
        Update: {
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          position?: number
        }
      }
      videos: {
        Row: {
          id: string
          playlist_id: string
          youtube_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          duration: number
          url: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          playlist_id: string
          youtube_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          duration: number
          url: string
          position?: number
        }
        Update: {
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          position?: number
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          completed: boolean
          watch_time: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          video_id: string
          completed?: boolean
          watch_time?: number
          completed_at?: string | null
        }
        Update: {
          completed?: boolean
          watch_time?: number
          completed_at?: string | null
        }
      }
      learning_sessions: {
        Row: {
          id: string
          user_id: string
          date: string
          videos_completed: number
          watch_time: number
          xp_earned: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          date: string
          videos_completed?: number
          watch_time?: number
          xp_earned?: number
        }
        Update: {
          videos_completed?: number
          watch_time?: number
          xp_earned?: number
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          type: string
          requirement: number | null
          xp_reward: number
          created_at: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          user_id: string
          achievement_id: string
        }
      }
      friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
        }
        Insert: {
          user_id: string
          friend_id: string
          status?: string
        }
        Update: {
          status?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          message: string
          type: string
          read?: boolean
          data?: Json | null
        }
        Update: {
          read?: boolean
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at: string
        }
        Insert: {
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
        }
      }
    }
  }
}
