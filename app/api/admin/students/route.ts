import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuthToken, isAdmin } from '@/app/lib/auth-helper';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuthToken(request);
    
    if (!auth.success) {
      return auth.response;
    }

    if (!isAdmin(auth.user!.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const students = await prisma.studentRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        country: true,
        status: true,
        enrollmentDate: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}