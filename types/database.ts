export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          subscription_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          subscription_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          subscription_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          title: string
          price: number
          image_url: string
          description: string | null
          affiliate_link: string
          user_id: string | null
          likes_count: number
          source: 'manual' | 'scraper'
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          price: number
          image_url: string
          description?: string | null
          affiliate_link: string
          user_id?: string | null
          likes_count?: number
          source?: 'manual' | 'scraper'
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          image_url?: string
          description?: string | null
          affiliate_link?: string
          user_id?: string | null
          likes_count?: number
          source?: 'manual' | 'scraper'
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          user_id: string
          offer_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          offer_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          offer_id?: string
          created_at?: string
        }
      }
    }
  }
}
