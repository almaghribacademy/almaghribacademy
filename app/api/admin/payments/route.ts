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

    const payments = await prisma.payment.findMany({
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
        enrollment: {
          select: {
            id: true,
            course: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Format the response
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      invoiceNumber: payment.invoiceNumber,
      student: payment.studentRegistration,
      enrollment: payment.enrollment,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      status: payment.status,
      paymentDate: payment.paymentDate,
      notes: payment.notes,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedPayments
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
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
      enrollmentId, 
      amount, 
      currency, 
      paymentMethod, 
      transactionId, 
      status,
      notes 
    } = body;

    // Validate required fields
    if (!studentId || !amount) {
      return NextResponse.json(
        { success: false, message: 'Student ID and Amount are required' },
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

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = await prisma.payment.create({
      data: {
        studentId: parseInt(studentId),
        enrollmentId: enrollmentId ? parseInt(enrollmentId) : null,
        invoiceNumber,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        paymentMethod: paymentMethod || 'cash',
        transactionId: transactionId || null,
        status: status || 'pending',
        notes: notes || null,
        paymentDate: new Date()
      },
      include: {
        studentRegistration: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // If payment is completed, update enrollment fee paid status
    if (status === 'completed' && enrollmentId) {
      await prisma.enrollment.update({
        where: { id: parseInt(enrollmentId) },
        data: { 
          feePaid: true,
          amountPaid: parseFloat(amount)
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment created successfully'
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}