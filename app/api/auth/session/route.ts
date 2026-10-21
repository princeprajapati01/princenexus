import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No session token' },
        { status: 401 }
      );
    }

    const payload = await verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name || 'Admin',
        role: payload.role,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Session validation error' },
      { status: 500 }
    );
  }
}
