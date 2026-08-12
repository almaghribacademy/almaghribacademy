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

    console.log('Fetching dashboard data...');
    
    // Get all trials with proper error handling
    let allTrials = [];
    try {
      allTrials = await prisma.studentTrial.findMany({
        orderBy: { createdAt: 'desc' },
      });
      console.log(`Found ${allTrials.length} trials`);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If table doesn't exist, return empty data
      return NextResponse.json({
        totalTrials: 0,
        pendingTrials: 0,
        confirmedTrials: 0,
        completedTrials: 0,
        recentTrials: [],
        error: 'No data found'
      });
    }

    // Calculate stats
    const totalTrials = allTrials.length;
    const pendingTrials = allTrials.filter(t => t.status === 'pending').length;
    const confirmedTrials = allTrials.filter(t => t.status === 'confirmed').length;
    const completedTrials = allTrials.filter(t => t.status === 'completed').length;
    const cancelledTrials = allTrials.filter(t => t.status === 'cancelled').length;

    // Get recent trials (last 10)
    const recentTrials = allTrials.slice(0, 10);

    return NextResponse.json({
      totalTrials,
      pendingTrials,
      confirmedTrials,
      completedTrials,
      cancelledTrials,
      recentTrials,
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    // Return empty data instead of error
    return NextResponse.json({
      totalTrials: 0,
      pendingTrials: 0,
      confirmedTrials: 0,
      completedTrials: 0,
      cancelledTrials: 0,
      recentTrials: [],
    });
  }
}