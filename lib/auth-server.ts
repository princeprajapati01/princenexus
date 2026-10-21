import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { signAdminToken, ADMIN_COOKIE_NAME, AdminJwtPayload } from './auth-jwt';

/**
 * Hash a password using scrypt with a unique random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify password against a stored hash (or plain text fallback for env vars)
 */
export function verifyPassword(password: string, storedHashOrPlain: string): boolean {
  try {
    if (!storedHashOrPlain || !password) return false;

    // Check if it's in salt:hash format
    if (storedHashOrPlain.includes(':')) {
      const [salt, key] = storedHashOrPlain.split(':');
      if (!salt || !key) return false;
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKey = crypto.scryptSync(password, salt, 64);
      if (keyBuffer.length !== derivedKey.length) return false;
      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    }

    // Direct constant-time string comparison for plain-text env passwords
    const bufferA = Buffer.from(password);
    const bufferB = Buffer.from(storedHashOrPlain);
    if (bufferA.length !== bufferB.length) return false;
    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Validates admin credentials against environment variables and/or database
 */
export async function validateAdminCredentials(emailInput: string, passwordInput: string) {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput;

  const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@princenexus.com').trim().toLowerCase();
  const envAdminPassword = process.env.ADMIN_PASSWORD || 'changeme';

  // 1. Check if matches environment variable credentials
  const matchesEnvEmail = email === envAdminEmail;
  const matchesEnvPassword = verifyPassword(password, envAdminPassword);

  if (matchesEnvEmail && matchesEnvPassword) {
    // Upsert or retrieve user in database for record keeping
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: envAdminEmail },
      });

      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            email: envAdminEmail,
            name: 'Prince Nexus Admin',
            role: 'admin',
            password: hashPassword(password),
          },
        });
        return {
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        };
      } else {
        return {
          success: true,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
          },
        };
      }
    } catch (dbErr) {
      console.warn('DB user lookup warning (proceeding with env auth):', dbErr);
      return {
        success: true,
        user: {
          id: 'admin_env',
          email: envAdminEmail,
          name: 'Prince Nexus Admin',
          role: 'admin',
        },
      };
    }
  }

  // 2. Check if matches a registered admin user in the database
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (dbUser && dbUser.password && dbUser.role === 'admin') {
      const isMatch = verifyPassword(password, dbUser.password);
      if (isMatch) {
        return {
          success: true,
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
          },
        };
      }
    }
  } catch (err) {
    console.error('Error checking DB for user:', err);
  }

  return {
    success: false,
    error: 'Invalid email or password',
  };
}

/**
 * Sets secure HTTP-only admin session cookie in Route Handler
 */
export async function setAdminSessionCookie(payload: AdminJwtPayload) {
  const token = await signAdminToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

/**
 * Clears the admin session cookie
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
