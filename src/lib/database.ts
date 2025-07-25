import { supabase } from './supabase'
import type { Profile, Order, Submission } from './supabase'

// Tracking code generation
export const generateTrackingCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'GOM-'
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// Order slug generation
export const generateOrderSlug = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let slug = ''
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)]
  }
  return slug
}

// Image upload utilities
export const uploadPaymentProof = async (file: File, orderId: string): Promise<string | null> => {
  const fileName = `${orderId}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file)
    
  if (error) {
    console.error('Error uploading payment proof:', error)
    return null
  }
  
  return data.path
}

export const uploadProductImage = async (file: File, gomId: string): Promise<string | null> => {
  const fileName = `${gomId}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)
    
  if (error) {
    console.error('Error uploading product image:', error)
    return null
  }
  
  // Return public URL for product images
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path)
    
  return publicUrl
}

export const getPaymentProofUrl = async (path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .createSignedUrl(path, 3600) // 1 hour expiry
    
  if (error) {
    console.error('Error getting payment proof URL:', error)
    return null
  }
  
  return data.signedUrl
}

// Database operations
export const createProfile = async (profileData: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single()
    
  if (error) {
    console.error('Error creating profile:', error)
    return null
  }
  
  return data
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (error) {
    console.error('Error getting profile:', error)
    return null
  }
  
  return data
}

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  
  return data
}

export const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
  // Generate unique slug
  let slug = generateOrderSlug()
  let slugExists = true
  
  while (slugExists) {
    const { data } = await supabase
      .from('orders')
      .select('id')
      .eq('shareable_slug', slug)
      .single()
      
    if (!data) {
      slugExists = false
    } else {
      slug = generateOrderSlug()
    }
  }
  
  const { data, error } = await supabase
    .from('orders')
    .insert({ ...orderData, shareable_slug: slug })
    .select()
    .single()
    
  if (error) {
    console.error('Error creating order:', error)
    return null
  }
  
  return data
}

export const getOrder = async (slug: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('shareable_slug', slug)
    .single()
    
  if (error) {
    console.error('Error getting order:', error)
    return null
  }
  
  return data
}

export const getOrdersByGom = async (gomId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('gom_id', gomId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error getting orders by GOM:', error)
    return []
  }
  
  return data
}

export const getRecentOrders = async (limit: number = 10): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error) {
    console.error('Error getting recent orders:', error)
    return []
  }
  
  return data
}

export const createSubmission = async (submissionData: Partial<Submission>): Promise<Submission | null> => {
  // Generate unique tracking code for guest users
  if (!submissionData.buyer_id && submissionData.guest_email) {
    let trackingCode = generateTrackingCode()
    let codeExists = true
    
    while (codeExists) {
      const { data } = await supabase
        .from('submissions')
        .select('id')
        .eq('tracking_code', trackingCode)
        .single()
        
      if (!data) {
        codeExists = false
      } else {
        trackingCode = generateTrackingCode()
      }
    }
    
    submissionData.tracking_code = trackingCode
  }
  
  const { data, error } = await supabase
    .from('submissions')
    .insert(submissionData)
    .select()
    .single()
    
  if (error) {
    console.error('Error creating submission:', error)
    return null
  }
  
  return data
}

export const getSubmissionsByOrder = async (orderId: string): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error getting submissions by order:', error)
    return []
  }
  
  return data
}

export const updateSubmission = async (submissionId: string, updates: Partial<Submission>): Promise<Submission | null> => {
  const { data, error } = await supabase
    .from('submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating submission:', error)
    return null
  }
  
  return data
}

export const getSubmissionByTrackingCode = async (trackingCode: string, email?: string): Promise<Submission | null> => {
  let query = supabase
    .from('submissions')
    .select('*, orders(*)')
    .eq('tracking_code', trackingCode)
    
  if (email) {
    query = query.eq('guest_email', email)
  }
  
  const { data, error } = await query.single()
    
  if (error) {
    console.error('Error getting submission by tracking code:', error)
    return null
  }
  
  return data
}

// MOQ and deadline checking
export const checkMOQ = async (orderId: string): Promise<void> => {
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
    
  if (order && order.current_order_count >= order.minimum_order_quantity && order.status === 'open') {
    await supabase
      .from('orders')
      .update({ status: 'moq_met' })
      .eq('id', orderId)
  }
}

export const checkExpiredOrders = async (): Promise<void> => {
  const { data: expiredOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'open')
    .lt('deadline', new Date().toISOString())
    
  if (expiredOrders) {
    for (const order of expiredOrders) {
      if (order.current_order_count < order.minimum_order_quantity) {
        // Cancel order
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', order.id)
      }
    }
  }
}