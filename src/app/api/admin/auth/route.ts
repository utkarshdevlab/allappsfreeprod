import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Admin password hash for 'admin123'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ||
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Hash the provided password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Compare hashes
    if (passwordHash === ADMIN_PASSWORD_HASH) {
      // Generate a simple token (in production, use JWT)
      const token = crypto.randomBytes(32).toString('hex');

      return NextResponse.json({
        success: true,
        token,
        message: 'Authentication successful'
      });
    } else {
      // Log failed attempt (in production, implement rate limiting)
      console.warn(`Failed admin login attempt at ${new Date().toISOString()}`);

      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
