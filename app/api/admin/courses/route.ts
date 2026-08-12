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

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        courseCode: true,
        description: true,
        category: true,
        level: true,
        durationWeeks: true,
        price: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Include counts
        _count: {
          select: {
            studentRegistrations: true,
            enrollments: true,
            classes: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
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
    const { name, courseCode, description, category, level, durationWeeks, price, status } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Course name is required' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        name,
        courseCode,
        description,
        category,
        level,
        durationWeeks: durationWeeks ? parseInt(durationWeeks) : null,
        price: price ? parseFloat(price) : null,
        status: status || 'active'
      }
    });

    return NextResponse.json({
      success: true,
      data: course,
      message: 'Course created successfully'
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}