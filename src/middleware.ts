
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_session';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  // Allow access to login page itself
  if (pathname.startsWith('/login')) {
    // Optional: If logged in and trying to access /login, redirect to dashboard
    if (sessionCookie?.value === 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // If trying to access any other protected route without a valid session, redirect to login
  if (!sessionCookie || sessionCookie.value !== 'true') {
    const loginUrl = new URL('/login', request.url);
    // Optionally, add a 'from' query parameter to redirect back to the originally requested page after login
    if (pathname !== '/') { // Avoid adding 'from=/' for the root
        loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any other public assets (e.g., images in /public folder directly if not handled by _next/image)
     * We want to protect all pages, so the matcher includes '/'.
     * The login page itself is handled within the middleware logic.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
