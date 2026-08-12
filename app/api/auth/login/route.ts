import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT token
function generateToken(userId: number, email: string, role: string) {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'staff', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    let user = null;
    let userRole = role;
    let userId = null;
    let fullName = '';

    // Check different tables based on role
    switch (role) {
      case 'super_admin':
      case 'admin':
        user = await prisma.adminUser.findUnique({
          where: { email }
        });
        if (user) {
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return NextResponse.json(
              { success: false, message: 'Invalid email or password' },
              { status: 401 }
            );
          }
          userId = user.id;
          fullName = user.fullName;
          userRole = user.role;
          
          // Check if account is active
          if (user.status !== 'active') {
            return NextResponse.json(
              { success: false, message: 'Your account is not active. Please contact support.' },
              { status: 403 }
            );
          }
        } else {
          return NextResponse.json(
            { success: false, message: 'Account not found. Please check your email.' },
            { status: 404 }
          );
        }
        break;

      case 'staff':
        user = await prisma.staffRegistration.findUnique({
          where: { email }
        });
        if (user) {
          // Check if account is active
          if (user.status !== 'active') {
            return NextResponse.json(
              { success: false, message: 'Your account is not active. Please contact support.' },
              { status: 403 }
            );
          }
          userId = user.id;
          fullName = `${user.firstName} ${user.lastName}`;
          // In production, verify password here
          // For now, we'll accept any password for demo purposes
          // But we should still check if password exists
          if (!user.passwordHash) {
            return NextResponse.json(
              { success: false, message: 'Account not properly configured. Please contact support.' },
              { status: 403 }
            );
          }
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return NextResponse.json(
              { success: false, message: 'Invalid email or password' },
              { status: 401 }
            );
          }
        } else {
          return NextResponse.json(
            { success: false, message: 'Account not found. Please check your email.' },
            { status: 404 }
          );
        }
        break;

      case 'teacher':
        user = await prisma.teacherRegistration.findUnique({
          where: { email }
        });
        if (user) {
          if (user.status !== 'active') {
            return NextResponse.json(
              { success: false, message: 'Your account is not active. Please contact support.' },
              { status: 403 }
            );
          }
          userId = user.id;
          fullName = `${user.firstName} ${user.lastName}`;
          if (!user.passwordHash) {
            return NextResponse.json(
              { success: false, message: 'Account not properly configured. Please contact support.' },
              { status: 403 }
            );
          }
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return NextResponse.json(
              { success: false, message: 'Invalid email or password' },
              { status: 401 }
            );
          }
        } else {
          return NextResponse.json(
            { success: false, message: 'Account not found. Please check your email.' },
            { status: 404 }
          );
        }
        break;

      case 'student':
        user = await prisma.studentRegistration.findUnique({
          where: { email }
        });
        if (user) {
          if (user.status !== 'active') {
            return NextResponse.json(
              { success: false, message: 'Your account is not active. Please contact support.' },
              { status: 403 }
            );
          }
          userId = user.id;
          fullName = `${user.firstName} ${user.lastName}`;
          if (!user.passwordHash) {
            return NextResponse.json(
              { success: false, message: 'Account not properly configured. Please contact support.' },
              { status: 403 }
            );
          }
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return NextResponse.json(
              { success: false, message: 'Invalid email or password' },
              { status: 401 }
            );
          }
        } else {
          return NextResponse.json(
            { success: false, message: 'Account not found. Please check your email.' },
            { status: 404 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid role' },
          { status: 400 }
        );
    }

    // Generate JWT token
    const token = generateToken(userId!, email, userRole);
    
    // Set cookie with token
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Log login activity
    await prisma.activityLog.create({
      data: {
        userId: userId!,
        userType: role,
        action: 'login',
        entity: role,
        entityId: userId!.toString(),
        details: `User logged in with role: ${role}`,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    });

    // Return user data without sensitive information
    const userData = {
      id: userId,
      email: email,
      fullName: fullName,
      role: userRole,
    };

    return NextResponse.json({
      success: true,
      token: token,
      user: userData,
      role: userRole
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}