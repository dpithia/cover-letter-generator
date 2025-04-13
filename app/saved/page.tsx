import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getCoverLetters } from '@/app/actions/get-cover-letters'
import { Card, CardContent } from '@/components/ui/card'
import NavBar from '@/components/NavBar'
import LandingPage from '@/components/LandingPage'
import { FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function SavedLettersPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <LandingPage />
  }

  const { data: letters } = await getCoverLetters()

  return (
    <>
      <NavBar />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Cover Letters</h1>
          <p className="text-muted-foreground">
            View and manage your saved cover letters
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {letters?.map((letter) => (
            <Link key={letter.id} href={`/saved/${letter.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-lg mb-1">{letter.name}</h2>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(letter.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {letter.content}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {letters?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mb-2">No saved cover letters</h3>
              <p className="text-muted-foreground">
                Generate and save some cover letters to see them here
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
} 