'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getCoverLetters() {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      throw new Error('Not authenticated')
    }

    // Fetch cover letters for the current user
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return { data }
  } catch (error) {
    console.error('Error fetching cover letters:', error)
    throw error
  }
} 