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
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        role: string;
      };
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!['super_admin', 'admin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch all data in parallel
    const [
      totalStudents,
      totalTeachers,
      totalStaff,
      totalCourses,
      totalEnrollments,
      totalPayments,
      pendingTeacherApplications,
      pendingStudentTrials,
      recentStudents,
      recentTeachers,
      recentPayments
    ] = await Promise.all([
      prisma.studentRegistration.count(),
      prisma.teacherRegistration.count(),
      prisma.staffRegistration.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.payment.count(),
      prisma.teacherApplication.count({
        where: { status: 'pending' }
      }),
      prisma.studentTrial.count({
        where: { status: 'pending' }
      }),
      prisma.studentRegistration.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.teacherRegistration.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          studentRegistration: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalStaff,
        totalCourses,
        totalEnrollments,
        totalPayments,
        pendingTeacherApplications,
        pendingStudentTrials,
        recentStudents,
        recentTeachers,
        recentPayments
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}