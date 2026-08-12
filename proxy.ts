// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Role-based route protection configuration
// These match the actual URL paths (route groups like (dashboard) don't appear in URLs)
const roleBasedRoutes = {
  '/admin': ['super_admin', 'admin'],
  '/staff': ['super_admin', 'admin', 'staff'],
  '/teachers': ['super_admin', 'admin', 'teacher'],
  '/students': ['super_admin', 'admin', 'staff', 'teacher', 'student'],
  '/dashboard': ['super_admin', 'admin', 'staff', 'teacher', 'student'],
  '/profile': ['super_admin', 'admin', 'staff', 'teacher', 'student'],
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths (no authentication required)
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/api/auth/login',
    '/api/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/api/newsletter',
    '/api/contact',
    '/api/student-trials',
    '/api/teacher-applications',
    // Public pages (home, about, contact, courses, etc.)
    '/',
    '/about',
    '/contact',
    '/courses',
    '/teachers',
    '/faq',
    '/privacy',
    '/terms',
  ];
  
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  // Also check if it's a public page (starts with / but not protected)
  const isProtectedPath = Object.keys(roleBasedRoutes).some(route => 
    pathname.startsWith(route)
  );

  // Allow public paths without authentication
  if (isPublicPath) {
    // If user is already logged in and tries to access login/register, redirect to dashboard
    if ((pathname === '/auth/login' || pathname === '/auth/register') && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If it's not a public path and not a protected path, allow it (like API routes)
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check for token on protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

    // Check if the current path requires specific roles
    const matchingRoute = Object.keys(roleBasedRoutes).find(route => 
      pathname.startsWith(route)
    );

    if (matchingRoute) {
      const allowedRoles = roleBasedRoutes[matchingRoute as keyof typeof roleBasedRoutes];
      
      // Check if user's role is allowed for this route
      if (!allowedRoles.includes(decoded.role)) {
        // Redirect to appropriate dashboard based on role
        let redirectPath = '/dashboard';
        switch (decoded.role) {
          case 'super_admin':
          case 'admin':
            redirectPath = '/admin/dashboard';
            break;
          case 'staff':
            redirectPath = '/staff/dashboard';
            break;
          case 'teacher':
            redirectPath = '/teachers/dashboard';
            break;
          case 'student':
            redirectPath = '/students/dashboard';
            break;
        }
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId.toString());
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-email', decoded.email);

    // Continue to the route with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    // Invalid token - redirect to login
    console.error('Token verification failed:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    // Clear the invalid token
    response.cookies.delete('auth_token');
    return response;
  }
}

// Configure which routes this proxy applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public assets)
     * - .well-known (for security verification)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$|.well-known).*)',
  ],
};