// app/api/newsletter/route.ts
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
// ✅ Fixed: Default applied BEFORE transform
const envSchema = z.object({
  SMTP_HOST: z.string().default('smtp.zoho.com'),
  SMTP_PORT: z.string().default('587').transform(Number).pipe(z.number().int().positive()),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().email().default('contact@almaghrib.academy'),
  ADMIN_EMAIL: z.string().email().default('contact@almaghrib.academy'),
  NODE_ENV: z.string().default('development'),
});

// Parse with safe fallback
const envResult = envSchema.safeParse(process.env);

// Use config with defaults - never throw
const config = {
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.zoho.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'contact@almaghrib.academy',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'contact@almaghrib.academy',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Just log warnings, don't throw
if (!envResult.success) {
  console.warn('⚠️ Environment variables warnings (using defaults):', 
    envResult.error.format()
  );
}

// ============================================
// 3. INPUT VALIDATION SCHEMA
// ============================================
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// ============================================
// 4. SIMPLE IN-MEMORY RATE LIMITING
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

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
let transporter: nodemailer.Transporter | null = null;

if (config.SMTP_USER && config.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: config.NODE_ENV === 'production',
      },
      pool: true,
      maxConnections: 5,
      rateDelta: 1000,
      rateLimit: 5,
    });

    transporter.verify((error, success) => {
      if (error) {
        console.warn('⚠️ SMTP connection warning:', error.message);
      } else {
        console.log('✅ SMTP server is ready to send emails');
      }
    });
  } catch (error) {
    console.warn('⚠️ SMTP transporter creation failed:', error instanceof Error ? error.message : 'Unknown error');
    transporter = null;
  }
} else {
  console.warn('⚠️ SMTP credentials not configured. Email sending will be disabled.');
}

// ============================================
// 6. HELPER FUNCTION: Get Client IP
// ============================================
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP.trim();
  }

  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }

  return 'unknown';
}

// ============================================
// 7. MAIN POST HANDLER
// ============================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate Limiting
    const ip = getClientIP(request);
    const { allowed, remaining, resetTime } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many subscription attempts. Please try again later.',
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
    const validatedData = newsletterSchema.parse(body);
    const { email } = validatedData;

    // Get User Agent
    const userAgent = request.headers.get('user-agent') || 'Not recorded';

    // Check if email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'inactive' || existingSubscriber.status === 'unsubscribed') {
        const updated = await prisma.newsletterSubscriber.update({
          where: { email: email.toLowerCase().trim() },
          data: {
            status: 'active',
            ipAddress: ip,
            userAgent,
            updatedAt: new Date(),
          },
        });

        // Send welcome back email
        sendEmails({
          email: email.toLowerCase().trim(),
          subscriberId: updated.id.toString(),
          isWelcomeBack: true,
        }).catch(emailError => {
          console.error('Background email sending failed:', {
            error: emailError instanceof Error ? emailError.message : 'Unknown error',
            subscriberId: updated.id.toString(),
            email,
          });
        });

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
          data: { id: updated.id.toString() },
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        },
        { status: 400 }
      );
    }

    // Save to database
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        status: 'active',
        ipAddress: ip,
        userAgent,
      },
    });

    // Send emails
    sendEmails({
      email: email.toLowerCase().trim(),
      subscriberId: subscriber.id.toString(),
      isWelcomeBack: false,
    }).catch(emailError => {
      console.error('Background email sending failed:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        subscriberId: subscriber.id.toString(),
        email,
      });
    });

    console.log('Newsletter subscription successful:', {
      subscriberId: subscriber.id.toString(),
      email,
      ip,
      duration: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: {
        id: subscriber.id.toString(),
        email: subscriber.email,
      },
    });

  } catch (error) {
    console.error('Newsletter subscription error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${Date.now() - startTime}ms`,
    });

    if (error instanceof z.ZodError) {
      const errorArray = (error as any).issues || (error as any).errors || [];
      const formattedErrors = errorArray.map((err: any) => ({
        field: err.path?.join('.') || err.path || 'email',
        message: err.message || 'Invalid value',
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
        message: 'Failed to subscribe. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// ============================================
// 8. EMAIL SENDING FUNCTION
// ============================================
async function sendEmails(data: {
  email: string;
  subscriberId: string;
  isWelcomeBack?: boolean;
}) {
  const { email, subscriberId, isWelcomeBack = false } = data;

  if (!transporter) {
    console.warn('⚠️ Email transporter not configured. Skipping email sending for:', email);
    return;
  }

  const fromEmail = config.SMTP_FROM;
  const adminEmail = config.ADMIN_EMAIL;
  const currentYear = new Date().getFullYear();

  const escapeHtml = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // ============================================
  // SUBSCRIBER EMAIL
  // ============================================
  const subscriberEmailHtml = `
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
        .subscriber-id { 
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); 
          padding: 15px 20px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center;
          border: 1px solid #a5d6a7;
        }
        .subscriber-id strong { 
          font-size: 16px; 
          color: #0a2e7a; 
        }
        .features { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 15px 0; 
        }
        .features ul { 
          padding-left: 20px; 
        }
        .features li { 
          margin-bottom: 8px; 
        }
        .tip-box { 
          background: #fff8e1; 
          padding: 15px 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          border-left: 4px solid #ffc107;
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
        .unsubscribe-link { 
          color: #888; 
          text-decoration: underline; 
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
          <h1>${isWelcomeBack ? '🎉 Welcome Back!' : '📬 Welcome to AlMaghrib Academy Newsletter!'}</h1>
          <p>Your Journey to Islamic Knowledge Begins</p>
        </div>
        <div class="content">
          <h2>Dear Subscriber,</h2>
          <p>${isWelcomeBack 
            ? 'We\'re so glad to have you back! You have been successfully resubscribed to the <strong>AlMaghrib Academy</strong> newsletter.' 
            : 'Thank you for subscribing to the <strong>AlMaghrib Academy</strong> newsletter! We\'re excited to have you join our growing community of learners.'
          }</p>
          
          <div class="subscriber-id">
            <strong>📌 Your Subscription ID: #${subscriberId}</strong>
          </div>

          <h3>What You'll Receive:</h3>
          <div class="features">
            <ul>
              <li>📖 Quran learning tips and guides</li>
              <li>📚 Islamic educational resources</li>
              <li>🎓 New course announcements</li>
              <li>💡 Expert insights and articles</li>
              <li>🎉 Special offers and events</li>
            </ul>
          </div>

          <div class="tip-box">
            <strong>💡 Tip:</strong> Add <a href="mailto:${adminEmail}" style="color: #0a2e7a;">${adminEmail}</a> to your address book to ensure our emails reach your inbox.
          </div>

          <div style="text-align: center; margin: 30px 0 10px;">
            <a href="https://almaghrib.academy" class="btn">Visit Our Website</a>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
            You can <a href="https://almaghrib.academy/unsubscribe?email=${encodeURIComponent(email)}" class="unsubscribe-link">unsubscribe</a> at any time.
          </p>
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
  // ADMIN EMAIL
  // ============================================
  let subscriberCount = 0;
  try {
    subscriberCount = await prisma.newsletterSubscriber.count({
      where: { status: 'active' }
    });
  } catch (error) {
    // Ignore count error
  }

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
          background: #e8f5e9; 
          padding: 15px 20px; 
          border-radius: 8px; 
          border-left: 4px solid #22c55e; 
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
        }
        .detail-row:last-child { 
          border-bottom: none; 
        }
        .detail-label { 
          font-weight: 600; 
          min-width: 120px; 
          color: #555; 
        }
        .detail-value { 
          flex: 1; 
        }
        .stats { 
          display: flex; 
          gap: 20px; 
          margin: 20px 0; 
          flex-wrap: wrap; 
        }
        .stat-box { 
          flex: 1; 
          min-width: 120px; 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center; 
        }
        .stat-box .number { 
          font-size: 24px; 
          font-weight: 700; 
          color: #0a2e7a; 
        }
        .stat-box .label { 
          font-size: 12px; 
          color: #888; 
          margin-top: 4px; 
        }
        .actions { 
          display: flex; 
          gap: 10px; 
          flex-wrap: wrap; 
          margin: 20px 0; 
        }
        .btn { 
          display: inline-block; 
          padding: 10px 20px; 
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
        .btn-email { background: #28a745; }
        .btn-dashboard { background: #007bff; }
        .footer { 
          text-align: center; 
          padding: 20px 30px; 
          color: #888; 
          font-size: 13px; 
          border-top: 1px solid #eee;
          background: #fafafa;
        }
        @media (max-width: 480px) {
          .stats { flex-direction: column; }
          .stat-box { min-width: auto; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Newsletter Subscriber</h1>
          <p>AlMaghrib Academy - Newsletter Subscription</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>✅ New Subscriber:</strong> A new user has subscribed to your newsletter.
          </div>

          <h2>Subscriber Details</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Subscriber ID:</span>
              <span class="detail-value"><strong>#${subscriberId}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value"><span style="color: #22c55e;">✓ Active</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</span>
            </div>
          </div>

          <div class="stats">
            <div class="stat-box">
              <div class="number">${subscriberCount}</div>
              <div class="label">Total Subscribers</div>
            </div>
            <div class="stat-box">
              <div class="number">${isWelcomeBack ? '🔄' : '🆕'}</div>
              <div class="label">${isWelcomeBack ? 'Re-subscribed' : 'New Subscriber'}</div>
            </div>
          </div>

          <h2>Quick Actions</h2>
          <div class="actions">
            <a href="mailto:${email}" class="btn btn-email">📧 Email Subscriber</a>
            <a href="https://almaghrib.academy/admin/newsletter" class="btn btn-dashboard">📊 View All</a>
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
    // Send Subscriber Email
    await sendWithRetry({
      from: `"AlMaghrib Academy" <${fromEmail}>`,
      to: email,
      subject: isWelcomeBack
        ? `🎉 Welcome Back to AlMaghrib Academy - #${subscriberId}`
        : `Welcome to AlMaghrib Academy Newsletter - #${subscriberId}`,
      html: subscriberEmailHtml,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
        'List-Unsubscribe': `<https://almaghrib.academy/unsubscribe?email=${encodeURIComponent(email)}>`,
      },
    });
    console.log('Subscriber email sent successfully to:', email);

    // Send Admin Email
    await sendWithRetry({
      from: `"AlMaghrib Academy Website" <${fromEmail}>`,
      to: adminEmail,
      subject: `📬 New Newsletter Subscriber - ${email}`,
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
      subscriberId,
      email,
    });
  }
}

// ============================================
// 9. OPTIONS HANDLER (CORS)
// ============================================
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}