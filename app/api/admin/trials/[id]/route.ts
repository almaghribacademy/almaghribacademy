import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // ← Must await params

    const trial = await prisma.studentTrial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trial) {
      return NextResponse.json(
        { error: 'Trial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trial);

  } catch (error) {
    console.error('Trial fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trial' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // ← Must await params
    const body = await request.json();
    const { status } = body;

    const trial = await prisma.studentTrial.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(trial);

  } catch (error) {
    console.error('Trial update error:', error);
    return NextResponse.json(
      { error: 'Failed to update trial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // ← Must await params

    await prisma.studentTrial.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Trial delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete trial' },
      { status: 500 }
    );
  }
}