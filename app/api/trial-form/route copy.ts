import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Helper function to format time with AM/PM
function formatTimeWithAMPM(timeStr: string) {
  if (!timeStr) return 'Not specified';
  
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Configure Zoho Mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

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

    // Save to database
    const trial = await prisma.studentTrial.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        country,
        preferredCourse: course,
        sessionFor: session,
        preferredTeacher: teacher,
        source: source || null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime: preferredTime || null,
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          null,
        userAgent: request.headers.get('user-agent') || null,
        status: 'pending',
      },
    });

    // Send emails
    await sendEmails({
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
      { success: false, message: 'Failed to submit trial booking' },
      { status: 500 }
    );
  }
}

// Email sending function
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
  const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Not specified';
  
  const formattedTime = formatTimeWithAMPM(preferredTime);
  const formattedSource = source || 'Not specified';
  const detectedCountryText = detectedCountry || 'Not detected';

  const fromEmail = process.env.SMTP_FROM || 'contact@AlMaghribacademy.co';

  // Email to Student
  const studentEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333333; 
          background: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background: #ffffff;
        }
        .logo-container {
          text-align: center;
          padding: 30px 0 20px 0;
          background: #ffffff;
        }
        .logo {
          max-width: 180px;
          height: auto;
        }
        .header { 
          background: #0a2e7a; 
          color: #ffffff; 
          padding: 30px 20px; 
          text-align: center; 
          border-radius: 12px 12px 0 0; 
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
          background: #ffffff; 
          padding: 30px; 
          border-radius: 0 0 12px 12px;
          border: 1px solid #e8e8e8;
          border-top: none;
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
          background: #ffffff;
        }
        .btn { 
          display: inline-block; 
          padding: 12px 35px; 
          background: #0a2e7a; 
          color: #ffffff; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600;
        }
        .btn:hover {
          background: #ff1493;
        }
        .status { 
          display: inline-block; 
          padding: 5px 15px; 
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
        .footer-links {
          color: #888;
          font-size: 12px;
          margin-top: 5px;
        }
        .footer-links a {
          color: #0a2e7a;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Logo -->
        <div class="logo-container">
          <img src="/assets/images/only-logo.png" alt="AlMaghrib Academy" class="logo" />
        </div>

        <div class="header">
          <h1>Trial Booking Confirmation</h1>
          <p>AlMaghrib Academy - Your Learning Journey Begins</p>
        </div>
        
        <div class="content">
          <h2>Dear ${studentName},</h2>
          <p>Thank you for booking a free trial session with <strong style="color: #0a2e7a;">AlMaghrib Academy</strong>. We're excited to help you begin your learning journey!</p>
          
          <div class="details">
            <h3>📋 Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${trialId}</span>
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
              <span class="detail-label">Preferred Teacher:</span>
              <span class="detail-value">${teacher}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Time:</span>
              <span class="detail-value">${formattedTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">How did you find us?</span>
              <span class="detail-value">${formattedSource}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value"><span class="status">Pending Confirmation</span></span>
            </div>
          </div>

          <h3>📞 What's Next?</h3>
          <p>Our team will contact you within <strong>24 hours</strong> to confirm your trial session details and answer any questions you may have.</p>
          
          <div class="highlight-box">
            <p style="margin: 0;"><strong>💡 Tip:</strong> Prepare any questions you have about the course. We're here to help!</p>
          </div>

          <hr class="divider" />

          <div style="text-align: center; margin-top: 25px;">
            <a href="https://AlMaghribacademy.co" class="btn">Visit Our Website</a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.</p>
          <p class="footer-links">Contact: <a href="mailto:contact@AlMaghribacademy.co">contact@AlMaghribacademy.co</a> | Phone: +44 7700 181874</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email to Admin
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333333; 
          background: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background: #ffffff;
        }
        .logo-container {
          text-align: center;
          padding: 30px 0 20px 0;
          background: #ffffff;
        }
        .logo {
          max-width: 180px;
          height: auto;
        }
        .header { 
          background: #0a2e7a; 
          color: #ffffff; 
          padding: 30px 20px; 
          text-align: center; 
          border-radius: 12px 12px 0 0; 
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
          background: #ffffff; 
          padding: 30px; 
          border-radius: 0 0 12px 12px;
          border: 1px solid #e8e8e8;
          border-top: none;
        }
        .content h2 {
          color: #0a2e7a;
          font-size: 20px;
          margin-top: 20px;
          margin-bottom: 15px;
        }
        .content h2:first-of-type {
          margin-top: 0;
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
          width: 180px; 
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
          background: #ffffff;
        }
        .btn { 
          display: inline-block; 
          padding: 12px 30px; 
          background: #0a2e7a; 
          color: #ffffff; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600;
        }
        .btn:hover {
          opacity: 0.9;
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
        .btn-green {
          background: #28a745;
        }
        .btn-blue {
          background: #007bff;
        }
        .btn-green:hover,
        .btn-blue:hover {
          opacity: 0.9;
        }
        .note-box {
          background: #f0f7ff;
          padding: 15px 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #0a2e7a;
        }
        .footer-links {
          color: #888;
          font-size: 12px;
          margin-top: 5px;
        }
        .footer-links a {
          color: #0a2e7a;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Logo -->
        <div class="logo-container">
          <img src="/assets/images/only-logo.png" alt="AlMaghrib Academy" class="logo" />
        </div>

        <div class="header">
          <h1>📝 New Trial Booking</h1>
          <p>AlMaghrib Academy - Student Trial Request</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <strong>⚠️ Action Required:</strong> A new trial booking has been submitted and requires confirmation.
          </div>

          <h2>👤 Student Information</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Student Name:</span>
              <span class="detail-value">${studentName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${phone}</span>
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

          <h2>📚 Trial Details</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${trialId}</span>
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
              <span class="detail-label">Preferred Teacher:</span>
              <span class="detail-value">${teacher}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Time:</span>
              <span class="detail-value">${formattedTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">How did you find us?</span>
              <span class="detail-value">${formattedSource}</span>
            </div>
          </div>

          <h2>⚡ Quick Actions</h2>
          <div class="action-buttons">
            <a href="mailto:${email}" class="btn btn-green">📧 Contact Student</a>
            <a href="https://AlMaghribacademy.co/admin/trials/${trialId}" class="btn btn-blue">📊 View in Dashboard</a>
          </div>

          <div class="note-box">
            <p style="margin: 0;"><strong>📌 Note:</strong> Please confirm this trial booking and contact the student within 24 hours.</p>
          </div>

          <hr class="divider" />

          <p style="color: #888; font-size: 13px; text-align: center;">This is an automated notification from your website.</p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.</p>
          <p class="footer-links">This is an automated notification from your website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send emails using Zoho
  try {
    // Test connection first
    await transporter.verify();
    console.log('Zoho SMTP connection verified successfully');

    // Email to Student
    await transporter.sendMail({
      from: `"AlMaghrib Academy" <${fromEmail}>`,
      to: email,
      subject: 'Your Trial Booking Confirmation - AlMaghrib Academy',
      html: studentEmailHtml,
    });
    console.log('Student email sent successfully to:', email);

    // Email to Admin
    await transporter.sendMail({
      from: `"AlMaghrib Academy Website" <${fromEmail}>`,
      to: 'contact@AlMaghribacademy.co',
      subject: '📝 New Trial Booking - Action Required',
      html: adminEmailHtml,
    });
    console.log('Admin email sent successfully to: contact@AlMaghribacademy.co');

  } catch (emailError) {
    console.error('Email sending error:', emailError);
    // Don't throw error - form submission already succeeded
  }
}