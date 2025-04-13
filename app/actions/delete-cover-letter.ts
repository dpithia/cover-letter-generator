'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function deleteCoverLetter(id: string) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      throw new Error('Not authenticated')
    }

    // Delete the cover letter
    const { error } = await supabase
      .from('cover_letters')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure user can only delete their own letters

    if (error) {
      throw error
    }

    revalidatePath('/saved')
    return { success: true }
  } catch (error) {
    console.error('Error deleting cover letter:', error)
    throw error
  }
} 