// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// ============================================
// 1. DATABASE CONNECTION (Singleton Pattern)
// ============================================
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ============================================
// 2. ENVIRONMENT VARIABLES VALIDATION (FIXED)
// ============================================
const envSchema = z.object({
  SMTP_HOST: z.string().min(1).default('smtp.zoho.com'),
  SMTP_PORT: z
  .string()
  .default("587")
  .transform(Number)
  .pipe(z.number().int().positive()),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().email().default('contact@almaghrib.academy'),
  ADMIN_EMAIL: z.string().email().default('contact@almaghrib.academy'),
  NODE_ENV: z.string().default('development'),
});

// Parse with fallback for missing env vars
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:', result.error.format());
  // Use defaults for development, throw in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables');
  }
}

// Use parsed values or defaults
const config = result.success ? result.data : {
  SMTP_HOST: 'smtp.zoho.com',
  SMTP_PORT: 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: 'contact@almaghrib.academy',
  ADMIN_EMAIL: 'contact@almaghrib.academy',
  NODE_ENV: 'development',
};

// ============================================
// 3. INPUT VALIDATION SCHEMA
// ============================================
const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number must be at least 5 characters').max(20),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// ============================================
// 4. SIMPLE IN-MEMORY RATE LIMITING
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up old entries
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - record.count,
    resetTime: record.resetTime
  };
}

// ============================================
// 5. EMAIL TRANSPORTER CONFIGURATION
// ============================================
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: true,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
  pool: true,
  maxConnections: 5,
  rateDelta: 1000,
  rateLimit: 5,
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// ============================================
// 6. MAIN POST HANDLER
// ============================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate Limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const { allowed, remaining, resetTime } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          }
        }
      );
    }

    // Parse and Validate Input
    const body = await request.json();
    const validatedData = contactSchema.parse(body);
    const { fullName, email, phone, subject, message } = validatedData;

    // Get Metadata
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Not recorded";
    const userAgent = request.headers.get('user-agent') || 'Not recorded';
    const referer = request.headers.get('referer') || 'Not recorded';

    // Check for Duplicate Submissions
    const existingContact = await prisma.contactMessage.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        message: message.trim(),
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    if (existingContact) {
      return NextResponse.json(
        {
          success: false,
          message: 'Duplicate submission detected. Please wait before trying again.'
        },
        { status: 429 }
      );
    }

    // Save to Database
    const contact = await prisma.contactMessage.create({
      data: {
        fullName: fullName,  // ✅ CORRECT - matches your schema
        email,
        phone,               // ✅ Make sure you have this
        subject,             // ✅ And this
        message,
        ipAddress,
        userAgent,
        referer,
        status: "unread",
      },
    });

    // Send Emails (Asynchronously)
    sendEmails({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      contactId: contact.id,
      ipAddress,
      userAgent,
      referer,
    }).catch(emailError => {
      console.error('Background email sending failed:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        contactId: contact.id,
        email,
      });
    });

    console.log('Contact form submitted successfully:', {
      contactId: contact.id,
      email,
      ip: ipAddress,
      duration: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
      data: {
        id: contact.id,
        reference: `#${contact.id}`,
      },
    });

  } catch (error) {
    console.error('Contact form error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${Date.now() - startTime}ms`,
    });

    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map((issue: z.ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed. Please check your input.',
          errors: formattedErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// ============================================
// 7. EMAIL SENDING FUNCTION
// ============================================
async function sendEmails(data: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactId: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
}) {
  const {
    fullName,
    email,
    phone,
    subject,
    message,
    contactId,
    ipAddress,
    userAgent,
    referer,
  } = data;

  const fromEmail = config.SMTP_FROM;
  const adminEmail = config.ADMIN_EMAIL;
  const currentYear = new Date().getFullYear();

  // Helper function to escape HTML
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // ============================================
  // CLIENT EMAIL (Thank You)
  // ============================================
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          padding: 0; 
          background: #ffffff; 
          border-radius: 12px; 
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header { 
          background: linear-gradient(135deg, #0a2e7a 0%, #1a4a9a 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700; 
        }
        .header p { 
          margin: 8px 0 0; 
          opacity: 0.9; 
          font-size: 16px; 
        }
        .content { 
          padding: 35px 30px; 
        }
        .content h2 { 
          color: #0a2e7a; 
          margin-top: 0; 
        }
        .reference-box { 
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); 
          padding: 18px 20px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center;
          border: 1px solid #a5d6a7;
        }
        .reference-box strong { 
          font-size: 18px; 
          color: #0a2e7a; 
        }
        .message-summary { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 15px 0;
          border-left: 4px solid #0a2e7a;
        }
        .message-summary p { 
          margin: 5px 0; 
        }
        .message-content { 
          background: #ffffff; 
          padding: 15px; 
          border-radius: 8px; 
          margin-top: 10px; 
          border: 1px solid #e9ecef;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .cta-section { 
          margin: 25px 0; 
        }
        .btn { 
          display: inline-block; 
          padding: 12px 32px; 
          background: #0a2e7a; 
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn:hover { 
          background: #061f52; 
        }
        .footer { 
          text-align: center; 
          padding: 25px 30px; 
          color: #888; 
          font-size: 13px; 
          border-top: 1px solid #eee;
          background: #fafafa;
        }
        .footer a { 
          color: #0a2e7a; 
          text-decoration: none; 
        }
        .disclaimer { 
          font-size: 12px; 
          color: #aaa; 
          margin-top: 10px; 
        }
        @media (max-width: 480px) {
          .header { padding: 30px 20px; }
          .content { padding: 25px 20px; }
          .btn { display: block; text-align: center; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕌 Thank You for Contacting Us!</h1>
          <p>AlMaghrib Academy - Your Learning Journey Begins</p>
        </div>
        <div class="content">
          <h2>Dear ${escapeHtml(fullName)},</h2>
          <p>Thank you for reaching out to <strong>AlMaghrib Academy</strong>. We appreciate your interest in our programs.</p>
          
          <p>We have received your message and our team will review it shortly. A member of our support team will get back to you within <strong>24 hours</strong>.</p>
          
          <div class="reference-box">
            <strong>📌 Your Reference Number: #${contactId}</strong>
          </div>

          <h3>Your Message Summary:</h3>
          <div class="message-summary">
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <p><strong>Message:</strong></p>
            <div class="message-content">${escapeHtml(message)}</div>
          </div>

          <div class="cta-section">
            <p>In the meantime, you can:</p>
            <ul style="padding-left: 20px;">
              <li>📖 Explore our <a href="https://almaghrib.academy/courses" style="color: #0a2e7a;">courses</a></li>
              <li>📝 Book a <a href="https://almaghrib.academy/trial-form" style="color: #0a2e7a;">free trial</a></li>
              <li>📞 Call us at <a href="tel:+447700181874" style="color: #0a2e7a;">+44 7700 181874</a></li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0 10px;">
            <a href="https://almaghrib.academy" class="btn">Visit Our Website</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${currentYear} AlMaghrib Academy. All rights reserved.</p>
          <p>Contact: <a href="mailto:${adminEmail}">${adminEmail}</a> | Phone: +44 7700 181874</p>
          <p class="disclaimer">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // ============================================
  // ADMIN EMAIL (Notification)
  // ============================================
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          padding: 0; 
          background: #ffffff; 
          border-radius: 12px; 
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header { 
          background: linear-gradient(135deg, #0a2e7a 0%, #1a4a9a 100%); 
          color: white; 
          padding: 35px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 26px; 
        }
        .header p { 
          margin: 5px 0 0; 
          opacity: 0.9; 
        }
        .content { 
          padding: 30px; 
        }
        .alert { 
          background: #fff3cd; 
          padding: 15px 20px; 
          border-radius: 8px; 
          border-left: 4px solid #ffc107; 
          margin-bottom: 25px;
        }
        .details { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 15px 0; 
        }
        .detail-row { 
          display: flex; 
          padding: 8px 0; 
          border-bottom: 1px solid #eee; 
          align-items: flex-start;
        }
        .detail-row:last-child { 
          border-bottom: none; 
        }
        .detail-label { 
          font-weight: 600; 
          min-width: 120px; 
          color: #555; 
          flex-shrink: 0;
        }
        .detail-value { 
          flex: 1; 
          word-break: break-word;
        }
        .status-badge { 
          display: inline-block; 
          padding: 4px 14px; 
          background: #ffc107; 
          color: #333; 
          border-radius: 20px; 
          font-size: 13px; 
          font-weight: 600; 
        }
        .message-box { 
          background: #ffffff; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 10px 0; 
          border: 1px solid #e9ecef;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .actions { 
          display: flex; 
          gap: 12px; 
          flex-wrap: wrap; 
          margin: 20px 0; 
        }
        .btn { 
          display: inline-block; 
          padding: 10px 24px; 
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          font-size: 14px;
          transition: opacity 0.2s;
        }
        .btn:hover { 
          opacity: 0.9; 
        }
        .btn-reply { background: #28a745; }
        .btn-call { background: #17a2b8; }
        .btn-dashboard { background: #007bff; }
        .meta { 
          font-size: 12px; 
          color: #888; 
          margin-top: 20px; 
          padding-top: 15px; 
          border-top: 1px solid #eee; 
        }
        .meta p { 
          margin: 3px 0; 
        }
        .footer { 
          text-align: center; 
          padding: 20px 30px; 
          color: #888; 
          font-size: 13px; 
          border-top: 1px solid #eee;
          background: #fafafa;
        }
        @media (max-width: 480px) {
          .detail-row { flex-direction: column; }
          .detail-label { min-width: auto; margin-bottom: 2px; }
          .actions { flex-direction: column; }
          .btn { text-align: center; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📨 New Contact Message</h1>
          <p>AlMaghrib Academy - Contact Form Submission</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ Action Required:</strong> A new contact message has been submitted and requires your attention.
          </div>

          <h2 style="margin-top: 0;">Contact Details</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Reference #:</span>
              <span class="detail-value"><strong>${contactId}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value"><strong>${escapeHtml(fullName)}</strong></span>
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
              <span class="detail-label">Subject:</span>
              <span class="detail-value"><strong>${escapeHtml(subject)}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value"><span class="status-badge">🔴 Unread</span></span>
            </div>
          </div>

          <h2>Message</h2>
          <div class="message-box">${escapeHtml(message)}</div>

          <h2>Quick Actions</h2>
          <div class="actions">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="btn btn-reply">📧 Reply</a>
            <a href="tel:${phone}" class="btn btn-call">📞 Call</a>
            <a href="https://almaghrib.academy/admin/contact/${contactId}" class="btn btn-dashboard">📊 Dashboard</a>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>📌 Note:</strong> Please respond to this inquiry within 24 hours.
          </div>

          <div class="meta">
            <p><strong>IP Address:</strong> ${ipAddress}</p>
            <p><strong>User Agent:</strong> ${userAgent.substring(0, 150)}${userAgent.length > 150 ? '...' : ''}</p>
            <p><strong>Referer:</strong> ${referer}</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${currentYear} AlMaghrib Academy. All rights reserved.</p>
          <p>This is an automated notification from your website.</p>
        </div>
      </div>
    </html>
  `;

  // ============================================
  // SEND EMAILS WITH RETRY LOGIC
  // ============================================
  const sendWithRetry = async (options: nodemailer.SendMailOptions, maxRetries = 3) => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const info = await transporter.sendMail(options);
        return info;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Email attempt ${attempt} failed:`, {
          error: lastError.message,
          to: options.to,
          subject: options.subject,
        });

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to send email after ${maxRetries} attempts: ${lastError?.message}`);
  };

  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Send Client Email
    await sendWithRetry({
      from: `"AlMaghrib Academy" <${fromEmail}>`,
      to: email,
      subject: `Thank You for Contacting AlMaghrib Academy - #${contactId}`,
      html: clientEmailHtml,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });
    console.log('Client email sent successfully to:', email);

    // Send Admin Email
    await sendWithRetry({
      from: `"AlMaghrib Academy Website" <${fromEmail}>`,
      to: adminEmail,
      subject: `📨 New Contact Message from ${fullName} - #${contactId}`,
      html: adminEmailHtml,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High',
      },
    });
    console.log('Admin email sent successfully to:', adminEmail);

  } catch (emailError) {
    console.error('Email sending error:', {
      error: emailError instanceof Error ? emailError.message : 'Unknown error',
      contactId,
      email,
      adminEmail,
    });
  }
}

// ============================================
// 8. OPTIONS HANDLER (CORS)
// ============================================
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': 'https://almaghrib.academy',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}