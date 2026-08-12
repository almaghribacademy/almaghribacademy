import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching all trials...');
    
    let trials = [];
    try {
      trials = await prisma.studentTrial.findMany({
        orderBy: { createdAt: 'desc' },
      });
      console.log(`Found ${trials.length} trials`);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json([]);
    }

    return NextResponse.json(trials);

  } catch (error) {
    console.error('Trials fetch error:', error);
    return NextResponse.json([]);
  }
}