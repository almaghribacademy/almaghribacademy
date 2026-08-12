import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

    let userData = null;

    // Fetch user based on role
    switch (decoded.role) {
      case 'super_admin':
      case 'admin':
        const admin = await prisma.adminUser.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, fullName: true, role: true, status: true }
        });
        userData = admin;
        break;
      case 'staff':
        const staff = await prisma.staffRegistration.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, firstName: true, lastName: true, status: true }
        });
        if (staff) userData = { ...staff, fullName: `${staff.firstName} ${staff.lastName}` };
        break;
      case 'teacher':
        const teacher = await prisma.teacherRegistration.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, firstName: true, lastName: true, status: true }
        });
        if (teacher) userData = { ...teacher, fullName: `${teacher.firstName} ${teacher.lastName}` };
        break;
      case 'student':
        const student = await prisma.studentRegistration.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, firstName: true, lastName: true, status: true }
        });
        if (student) userData = { ...student, fullName: `${student.firstName} ${student.lastName}` };
        break;
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { ...userData, role: decoded.role }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
}