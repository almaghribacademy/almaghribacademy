import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  userId: number;
  email: string;
  role: string;
}

export function verifyAuthToken(request: NextRequest): { 
  success: boolean; 
  user?: AuthUser; 
  response?: NextResponse 
} {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return { success: true, user: decoded };
  } catch (error) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    };
  }
}

export function isAdmin(role: string): boolean {
  return ['super_admin', 'admin'].includes(role);
}