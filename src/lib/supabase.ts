import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  discord_id?: string
  discord_username?: string
  is_gom: boolean
  created_at: string
}

export interface Order {
  id: string
  gom_id: string
  product_name: string
  product_description?: string
  product_image_url?: string
  price: number
  currency: string
  country: string
  payment_methods: Record<string, any>
  payment_details: Record<string, any>
  minimum_order_quantity: number
  current_order_count: number
  status: 'open' | 'moq_met' | 'closed' | 'cancelled'
  deadline: string
  shareable_slug: string
  created_at: string
}

export interface Submission {
  id: string
  order_id: string
  buyer_id?: string
  guest_email?: string
  tracking_code: string
  quantity: number
  payment_method: string
  payment_proof_url?: string
  payment_verified: boolean
  tracking_number?: string
  courier_service?: string
  shipped_at?: string
  created_at: string
}