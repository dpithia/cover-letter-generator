import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req: request, res: response })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()
  const { data: { session } } = await supabase.auth.getSession()

  // Auth routes handling (signup, login)
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      // If user is signed in, redirect to home page
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to auth pages if not signed in
    return response
  }

  // Protected routes handling
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!session) {
      // If user is not signed in, redirect to signup
      return NextResponse.redirect(new URL('/auth/signup', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 