import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session')?.value
    
    // If no session token, redirect to login
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // For now, we'll let the page component handle role-based access
    // The session validation will happen on the page level
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}