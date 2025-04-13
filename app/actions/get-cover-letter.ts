'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getCoverLetter(id: string) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      throw new Error('Not authenticated')
    }

    // Fetch the specific cover letter
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure user can only access their own letters
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error('Cover letter not found')
    }

    return { data }
  } catch (error) {
    console.error('Error fetching cover letter:', error)
    throw error
  }
} 