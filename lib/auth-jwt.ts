import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

export interface AdminJwtPayload {
  id: string;
  email: string;
  role: string;
  name?: string | null;
  [key: string]: unknown;
}

export const ADMIN_COOKIE_NAME = 'admin_session';

/**
 * Returns secret key bytes for JWT signing & verification.
 * Edge-runtime and Node-runtime compatible.
 */
export function getJwtSecret(): Uint8Array {
  const secret =
    process.env.ADMIN_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'prince-nexus-portfolio-secure-jwt-secret-key-2026-v1';
  return new TextEncoder().encode(secret);
}

/**
 * Sign an admin session token (valid for 7 days)
 */
export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

/**
 * Verify an admin session token.
 * Returns decoded payload if valid, or null if expired/tampered.
 */
export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    if (!token) return null;
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}
