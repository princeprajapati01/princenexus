import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/auth-server';

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
