import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Proxy function (formerly middleware)
export default withAuth(async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuth = await getToken({ req: request });

  const protectedRoutes = ['/home','/message','/message/:path*', '/businesslinks', '/profile', '/contact',''];
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If not authenticated and accessing protected route
  if (!isAuth && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}, {
  // Optional callback function
  callbacks: {
    async authorized() {
      return true;
    },
  },
});

// Configuration for matcher
export const config = {
  matcher: ['/home','/message/:path*','/businesslinks', '/profile/:path*', '/contact', '/auth/:path*'],
};