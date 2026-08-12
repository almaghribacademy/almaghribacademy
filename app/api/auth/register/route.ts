import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (!['super_admin', 'admin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, fullName, role, ...userData } = body;

    // Validate input
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'staff', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let createdUser = null;

    // Create user based on role
    switch (role) {
      case 'admin':
        createdUser = await prisma.adminUser.create({
          data: {
            email,
            passwordHash: hashedPassword,
            fullName,
            role: 'admin',
            username: email.split('@')[0],
          }
        });
        break;

      case 'staff':
        createdUser = await prisma.staffRegistration.create({
          data: {
            email,
            passwordHash: hashedPassword,
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ').slice(1).join(' ') || 'Staff',
            phone: userData.phone || '',
            country: userData.country || 'Not specified',
            status: 'active',
            ...userData
          }
        });
        break;

      case 'teacher':
        createdUser = await prisma.teacherRegistration.create({
          data: {
            email,
            passwordHash: hashedPassword,
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ').slice(1).join(' ') || 'Teacher',
            phone: userData.phone || '',
            country: userData.country || 'Not specified',
            status: 'active',
            ...userData
          }
        });
        break;

      case 'student':
        createdUser = await prisma.studentRegistration.create({
          data: {
            email,
            passwordHash: hashedPassword,
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ').slice(1).join(' ') || 'Student',
            phone: userData.phone || '',
            country: userData.country || 'Not specified',
            status: 'active',
            ...userData
          }
        });
        break;
    }

    if (!createdUser) {
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${role} created successfully`,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        fullName: fullName,
        role: role
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}