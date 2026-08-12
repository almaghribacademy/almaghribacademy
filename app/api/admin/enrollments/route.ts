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

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

    if (!['super_admin', 'admin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        studentRegistration: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            courseCode: true
          }
        },
        teacherRegistration: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Format the response
    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      student: enrollment.studentRegistration,
      course: enrollment.course,
      teacher: enrollment.teacherRegistration,
      status: enrollment.status,
      progressPercentage: enrollment.progressPercentage,
      enrollmentDate: enrollment.enrollmentDate,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      feePaid: enrollment.feePaid,
      amountPaid: enrollment.amountPaid,
      paymentMethod: enrollment.paymentMethod,
      notes: enrollment.notes,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedEnrollments
    });

  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

    if (!['super_admin', 'admin'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      studentId, 
      courseId, 
      teacherId, 
      status, 
      startDate, 
      endDate,
      amountPaid,
      paymentMethod 
    } = body;

    // Validate required fields
    if (!studentId || !courseId) {
      return NextResponse.json(
        { success: false, message: 'Student ID and Course ID are required' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.studentRegistration.findUnique({
      where: { id: parseInt(studentId) }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if teacher exists (if provided)
    if (teacherId) {
      const teacher = await prisma.teacherRegistration.findUnique({
        where: { id: parseInt(teacherId) }
      });
      if (!teacher) {
        return NextResponse.json(
          { success: false, message: 'Teacher not found' },
          { status: 404 }
        );
      }
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: parseInt(studentId),
        courseId: parseInt(courseId),
        teacherId: teacherId ? parseInt(teacherId) : null,
        status: status || 'active',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        amountPaid: amountPaid ? parseFloat(amountPaid) : null,
        paymentMethod: paymentMethod || null,
        progressPercentage: 0,
        feePaid: false
      },
      include: {
        studentRegistration: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            name: true,
            courseCode: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: enrollment,
      message: 'Enrollment created successfully'
    });

  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}