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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (status && ['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
      whereClause.status = status;
    }

    const trials = await prisma.studentTrial.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: trials
    });

  } catch (error) {
    console.error('Error fetching student trials:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, status, preferredTeacher, preferredDate, preferredTime } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Trial ID is required' },
        { status: 400 }
      );
    }

    // Check if trial exists
    const trial = await prisma.studentTrial.findUnique({
      where: { id: parseInt(id) }
    });

    if (!trial) {
      return NextResponse.json(
        { success: false, message: 'Trial not found' },
        { status: 404 }
      );
    }

    // Update trial
    const updatedTrial = await prisma.studentTrial.update({
      where: { id: parseInt(id) },
      data: {
        status: status || trial.status,
        preferredTeacher: preferredTeacher || trial.preferredTeacher,
        preferredDate: preferredDate ? new Date(preferredDate) : trial.preferredDate,
        preferredTime: preferredTime || trial.preferredTime,
        updatedAt: new Date()
      }
    });

    // If trial is approved, create a student registration
    if (status === 'approved') {
      // Check if student already exists
      const existingStudent = await prisma.studentRegistration.findUnique({
        where: { email: trial.email }
      });

      if (!existingStudent) {
        await prisma.studentRegistration.create({
          data: {
            firstName: trial.firstName,
            lastName: trial.lastName,
            email: trial.email,
            phone: trial.phone,
            country: trial.country,
            preferredCourse: trial.preferredCourse,
            status: 'active',
            enrollmentDate: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedTrial,
      message: 'Trial updated successfully'
    });

  } catch (error) {
    console.error('Error updating student trial:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}