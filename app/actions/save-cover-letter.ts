'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface SaveCoverLetterParams {
  name: string
  content: string
  resumeText: string
  jobDescription: string
}

export async function saveCoverLetter({
  name,
  content,
  resumeText,
  jobDescription,
}: SaveCoverLetterParams) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      throw new Error('Not authenticated')
    }

    // Insert the cover letter
    const { data, error } = await supabase
      .from('cover_letters')
      .insert({
        user_id: session.user.id,
        name,
        content,
        resume_text: resumeText,
        job_description: jobDescription,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    revalidatePath('/')
    return { data }
  } catch (error) {
    console.error('Error saving cover letter:', error)
    throw error
  }
} 