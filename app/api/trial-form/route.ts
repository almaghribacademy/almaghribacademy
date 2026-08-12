import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

// ============================================
// SINGLETON PRISMA CLIENT (Fixes prepared statement error)
// ============================================
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper function to format time with AM/PM
function formatTimeWithAMPM(timeStr: string) {
  if (!timeStr) return 'Not specified';
  
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Helper to format date
function formatDate(dateStr: string) {
  if (!dateStr) return 'Not specified';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper to get client IP
function getClientIP(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    null
  );
}

// ============================================
// EMAIL TRANSPORTER
// ============================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true, // Enable connection pooling
  maxConnections: 5,
});

// ============================================
// POST HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      course,
      session,
      teacher,
      source,
      preferredDate,
      preferredTime,
      detectedCountry,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country || !course || !session || !teacher) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number (basic)
    const phoneRegex = /^[0-9]{7,15}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // ============================================
    // SAVE TO DATABASE
    // ============================================
    let trial;
    try {
      trial = await prisma.studentTrial.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          country: country.trim(),
          preferredCourse: course,
          sessionFor: session,
          preferredTeacher: teacher,
          source: source || null,
          preferredDate: preferredDate ? new Date(preferredDate) : null,
          preferredTime: preferredTime || null,
          detectedCountry: detectedCountry || null,
          ipAddress: getClientIP(request),
          userAgent: request.headers.get('user-agent') || null,
          status: 'pending',
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Handle prepared statement error
      if (dbError instanceof Error && dbError.message.includes('prepared statement')) {
        // Retry once
        try {
          await prisma.$disconnect();
          await prisma.$connect();
          
          trial = await prisma.studentTrial.create({
            data: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim().toLowerCase(),
              phone: cleanPhone,
              country: country.trim(),
              preferredCourse: course,
              sessionFor: session,
              preferredTeacher: teacher,
              source: source || null,
              preferredDate: preferredDate ? new Date(preferredDate) : null,
              preferredTime: preferredTime || null,
              detectedCountry: detectedCountry || null,
              ipAddress: getClientIP(request),
              userAgent: request.headers.get('user-agent') || null,
              status: 'pending',
            },
          });
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          return NextResponse.json(
            { success: false, message: 'Database connection issue. Please try again.' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, message: 'Failed to save booking to database' },
          { status: 500 }
        );
      }
    }

    // ============================================
    // SEND EMAILS
    // ============================================
    await sendEmails({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      country: country.trim(),
      course,
      session,
      teacher,
      source: source || 'Not specified',
      preferredDate,
      preferredTime,
      detectedCountry: detectedCountry || 'Not detected',
      trialId: trial.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Trial booking submitted successfully',
      data: { id: trial.id },
    });

  } catch (error) {
    console.error('Trial form error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to submit trial booking' 
      },
      { status: 500 }
    );
  }
}

// ============================================
// EMAIL SENDING FUNCTION
// ============================================

async function sendEmails(data: any) {
  const {
    firstName,
    lastName,
    email,
    phone,
    country,
    course,
    session,
    teacher,
    source,
    preferredDate,
    preferredTime,
    detectedCountry,
    trialId,
  } = data;

  const studentName = `${firstName} ${lastName}`;
  const formattedDate = formatDate(preferredDate);
  const formattedTime = formatTimeWithAMPM(preferredTime);
  const formattedSource = source || 'Not specified';
  const detectedCountryText = detectedCountry || 'Not detected';

  const fromEmail = process.env.SMTP_FROM || 'contact@almaghrib.academy';

  try {
    // Verify transporter connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // ============================================
    // SEND EMAIL TO STUDENT
    // ============================================
    const studentEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333333; 
            background: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .logo-container {
            text-align: center;
            padding: 30px 0 20px 0;
            background: #ffffff;
          }
          .logo {
            max-width: 60px;
            height: auto;
          }
          .header { 
            background: linear-gradient(135deg, #0a2e7a, #143f9f);
            color: #ffffff; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content { 
            padding: 30px; 
          }
          .content h2 {
            color: #0a2e7a;
            font-size: 22px;
            margin-top: 0;
          }
          .content h3 {
            color: #0a2e7a;
            font-size: 18px;
            margin-top: 0;
          }
          .details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 15px 0; 
          }
          .detail-row { 
            display: flex; 
            padding: 8px 0; 
            border-bottom: 1px solid #e8e8e8; 
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label { 
            font-weight: 600; 
            width: 150px; 
            color: #555; 
            flex-shrink: 0;
          }
          .detail-value { 
            flex: 1; 
            color: #333;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #888; 
            font-size: 14px; 
            background: #f8fafc;
          }
          .btn { 
            display: inline-block; 
            padding: 12px 35px; 
            background: #0a2e7a; 
            color: #ffffff; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600;
          }
          .btn:hover {
            background: #ff1493;
          }
          .status-badge { 
            display: inline-block; 
            padding: 4px 16px; 
            background: #ffc107; 
            color: #333; 
            border-radius: 20px; 
            font-size: 13px; 
            font-weight: 600; 
          }
          .highlight-box {
            background: #f0f7ff;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #0a2e7a;
          }
          .divider {
            border: none;
            border-top: 2px solid #e8e8e8;
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-container">
            <img src="https://AlMaghribacademy.co/assets/images/only-logo.png" alt="AlMaghrib Academy" class="logo" />
          </div>

          <div class="header">
            <h1>🎉 Trial Booking Confirmed</h1>
            <p>Your learning journey begins at AlMaghrib Academy</p>
          </div>
          
          <div class="content">
            <h2>Dear ${studentName},</h2>
            <p>Thank you for booking a free trial session with <strong style="color: #0a2e7a;">AlMaghrib Academy</strong>! We're excited to help you begin your learning journey.</p>
            
            <div class="details">
              <h3 style="margin-top: 0;">📋 Your Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value"><strong>#${String(trialId).padStart(6, '0')}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span class="detail-value">${course}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Trial For:</span>
                <span class="detail-value">${session}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Teacher:</span>
                <span class="detail-value">${teacher}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formattedTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge">⏳ Pending Confirmation</span></span>
              </div>
            </div>

            <h3>📞 What's Next?</h3>
            <p>Our team will contact you within <strong>24 hours</strong> to confirm your trial session details and answer any questions.</p>
            
            <div class="highlight-box">
              <p style="margin: 0;"><strong>💡 Tip:</strong> Prepare any questions you have about the course. We're here to help you succeed!</p>
            </div>

            <hr class="divider" />

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://AlMaghribacademy.co" class="btn">Visit Our Website</a>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.</p>
            <p style="margin: 5px 0 0; font-size: 12px;">
              <a href="mailto:contact@almaghrib.academy" style="color: #0a2e7a;">contact@almaghrib.academy</a> | 
              <a href="tel:+447700181874" style="color: #0a2e7a;">+44 7700 181874</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"AlMaghrib Academy" <${fromEmail}>`,
      to: email,
      subject: '✅ Trial Booking Confirmed - AlMaghrib Academy',
      html: studentEmailHtml,
    });
    console.log(`✅ Student email sent to: ${email}`);

    // ============================================
    // SEND EMAIL TO ADMIN
    // ============================================
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333333; 
            background: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .logo-container {
            text-align: center;
            padding: 30px 0 20px 0;
            background: #ffffff;
          }
          .logo {
            max-width: 60px;
            height: auto;
          }
          .header { 
            background: linear-gradient(135deg, #0a2e7a, #143f9f);
            color: #ffffff; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content { 
            padding: 30px; 
          }
          .alert { 
            background: #fff8e1; 
            padding: 15px 20px; 
            border-radius: 8px; 
            border-left: 4px solid #ffc107; 
            margin-bottom: 20px;
          }
          .alert strong {
            color: #856404;
          }
          .details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 15px 0; 
          }
          .detail-row { 
            display: flex; 
            padding: 8px 0; 
            border-bottom: 1px solid #e8e8e8; 
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label { 
            font-weight: 600; 
            width: 160px; 
            color: #555; 
            flex-shrink: 0;
          }
          .detail-value { 
            flex: 1; 
            color: #333;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #888; 
            font-size: 14px; 
            background: #f8fafc;
          }
          .btn { 
            display: inline-block; 
            padding: 12px 30px; 
            background: #0a2e7a; 
            color: #ffffff; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 600;
          }
          .btn:hover {
            opacity: 0.9;
          }
          .btn-green {
            background: #28a745;
          }
          .btn-blue {
            background: #007bff;
          }
          .divider {
            border: none;
            border-top: 2px solid #e8e8e8;
            margin: 25px 0;
          }
          .action-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin: 15px 0;
          }
          .note-box {
            background: #f0f7ff;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0a2e7a;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-container">
            <img src="https://AlMaghribacademy.co/assets/images/only-logo.png" alt="AlMaghrib Academy" class="logo" />
          </div>

          <div class="header">
            <h1>📝 New Trial Booking</h1>
            <p>Action Required - Student Trial Request</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ Action Required:</strong> A new trial booking has been submitted and requires confirmation.
            </div>

            <h2 style="color: #0a2e7a; font-size: 20px; margin-top: 0;">👤 Student Information</h2>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Student Name:</span>
                <span class="detail-value"><strong>${studentName}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><a href="tel:${phone}">${phone}</a></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Country:</span>
                <span class="detail-value">${country}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Detected Country:</span>
                <span class="detail-value">${detectedCountryText}</span>
              </div>
            </div>

            <h2 style="color: #0a2e7a; font-size: 20px;">📚 Trial Details</h2>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value"><strong>#${String(trialId).padStart(6, '0')}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span class="detail-value">${course}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Trial For:</span>
                <span class="detail-value">${session}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Teacher:</span>
                <span class="detail-value">${teacher}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formattedTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Source:</span>
                <span class="detail-value">${formattedSource}</span>
              </div>
            </div>

            <h2 style="color: #0a2e7a; font-size: 20px;">⚡ Quick Actions</h2>
            <div class="action-buttons">
              <a href="mailto:${email}" class="btn btn-green">📧 Contact Student</a>
              <a href="tel:${phone}" class="btn btn-blue">📞 Call Student</a>
            </div>

            <div class="note-box">
              <p style="margin: 0;"><strong>📌 Note:</strong> Please confirm this trial booking and contact the student within 24 hours.</p>
            </div>

            <hr class="divider" />

            <p style="color: #888; font-size: 13px; text-align: center;">This is an automated notification from your website.</p>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.</p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #aaa;">This is an automated notification from your website.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"AlMaghrib Academy Website" <${fromEmail}>`,
      to: 'contact@almaghrib.academy',
      subject: '📝 New Trial Booking - Action Required',
      html: adminEmailHtml,
    });
    console.log('✅ Admin email sent to: contact@almaghrib.academy');

  } catch (emailError) {
    console.error('❌ Email sending error:', emailError);
    // Don't throw error - form submission already succeeded
  }
}

// ============================================
// OPTIONAL: DISCONNECT ON SERVER SHUTDOWN
// ============================================
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});