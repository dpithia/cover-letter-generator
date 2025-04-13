import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NeuralLetterGenerator from '@/components/neural-letter-generator'
import NavBar from '@/components/NavBar'
import LandingPage from '@/components/LandingPage'

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <LandingPage />
  }

  return (
    <>
      <NavBar />
      <main className="container mx-auto py-8 px-4">
        <NeuralLetterGenerator />
      </main>
    </>
  )
}

