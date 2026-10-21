import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from './lib/auth-jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Admin Login Page
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyAdminToken(token);
      if (payload) {
        // User already logged in, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Allow Authentication API routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // 3. Protect all other /admin routes (Admin Dashboard)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      loginUrl.searchParams.set('error', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  }

  // 4. Protect Admin-only API routes
  if (isProtectedApiRoute(request)) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required' },
        { status: 401 }
      );
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired admin session' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Checks if the incoming request targets an admin-only API operation
 */
function isProtectedApiRoute(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Contact messages: GET is admin-only. PATCH/DELETE is admin-only. POST is public.
  if (pathname === '/api/contact' && method === 'GET') return true;
  if (pathname.startsWith('/api/contact/') && (method === 'PATCH' || method === 'DELETE')) return true;

  // Interviews: GET is admin-only. PATCH/DELETE is admin-only. POST is public.
  if (pathname === '/api/interviews' && method === 'GET') return true;
  if (pathname.startsWith('/api/interviews/') && (method === 'PATCH' || method === 'DELETE')) return true;

  // Settings: POST is admin-only. GET is public.
  if (pathname === '/api/settings' && method === 'POST') return true;

  // File uploads: POST is admin-only.
  if (pathname === '/api/upload' && method === 'POST') return true;

  // Projects management: POST, PATCH, DELETE are admin-only.
  if (pathname === '/api/projects' && method === 'POST') return true;
  if (pathname.startsWith('/api/projects/') && (method === 'PATCH' || method === 'DELETE')) return true;
  if (pathname === '/api/projects' && method === 'GET') {
    // Draft / unpublished projects are admin-only
    if (request.nextUrl.searchParams.get('published') === 'false') return true;
  }

  // Media management: POST and DELETE are admin-only.
  if (pathname === '/api/project-images' && (method === 'POST' || method === 'DELETE')) return true;
  if (pathname === '/api/project-videos' && (method === 'POST' || method === 'DELETE')) return true;

  return false;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/contact/:path*',
    '/api/contact',
    '/api/interviews/:path*',
    '/api/interviews',
    '/api/settings',
    '/api/upload',
    '/api/projects/:path*',
    '/api/projects',
    '/api/project-images',
    '/api/project-videos',
  ],
};
