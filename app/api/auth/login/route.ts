import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, setAdminSessionCookie } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const validation = await validateAdminCredentials(email, password);

    if (!validation.success || !validation.user) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set secure HTTP-only cookie
    await setAdminSessionCookie({
      id: validation.user.id,
      email: validation.user.email,
      name: validation.user.name,
      role: validation.user.role,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: validation.user.id,
        email: validation.user.email,
        name: validation.user.name,
        role: validation.user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
