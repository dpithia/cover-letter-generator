import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signup')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  // Fetch user's saved cover letters
  const { data: coverLetters } = await supabase
    .from('saved_cover_letters')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <NavBar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 shadow rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-white mb-6">Dashboard</h1>
            
            {/* User Profile Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-white mb-4">Your Profile</h2>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-300">Email: {session.user.email}</p>
                {profile && (
                  <>
                    <p className="text-sm text-gray-300 mt-2">Name: {profile.full_name || 'Not set'}</p>
                    <p className="text-sm text-gray-300 mt-2">Phone: {profile.phone || 'Not set'}</p>
                    <p className="text-sm text-gray-300 mt-2">LinkedIn: {profile.linkedin_url || 'Not set'}</p>
                  </>
                )}
                <div className="mt-4">
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Cover Letters Section */}
            <div>
              <h2 className="text-xl font-medium text-white mb-4">Your Cover Letters</h2>
              {coverLetters?.length ? (
                <div className="space-y-4">
                  {coverLetters.map((letter) => (
                    <div key={letter.id} className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-medium text-white">{letter.company_name}</h3>
                      <p className="text-sm text-gray-300 mt-1">Position: {letter.job_title}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Created: {new Date(letter.created_at!).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No cover letters created yet.</p>
              )}
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create New Cover Letter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 