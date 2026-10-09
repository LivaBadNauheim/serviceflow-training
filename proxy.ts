import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const rolle = await verifySessionToken(token)
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (rolle) {
      return NextResponse.redirect(new URL('/tische', request.url))
    }
    return NextResponse.next()
  }

  if (!rolle) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/admin') && rolle !== 'admin') {
    return NextResponse.redirect(new URL('/tische', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
