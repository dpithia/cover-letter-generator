import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/supabase'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Welcome, {profile?.full_name || session.user.email}</h2>
              <p className="mt-2 text-sm text-gray-600">
                This is your dashboard where you can manage your cover letters and profile.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">Email: {session.user.email}</p>
                  {profile && (
                    <>
                      <p className="text-sm text-gray-600">Name: {profile.full_name || 'Not set'}</p>
                      <p className="text-sm text-gray-600">Phone: {profile.phone || 'Not set'}</p>
                      <p className="text-sm text-gray-600">LinkedIn: {profile.linkedin_url || 'Not set'}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-4 space-y-4">
                  <a
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Update Profile
                  </a>
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 