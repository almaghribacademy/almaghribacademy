// app/api/teacher-application/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
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
// 2. ENVIRONMENT VARIABLES VALIDATION
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
  SMTP_FROM: z.string().email().default('contact@AlMaghribacademy.co'),
  ADMIN_EMAIL: z.string().email().default('contact@AlMaghribacademy.co'),
  NODE_ENV: z.string().default('development'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:', result.error.format());
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables');
  }
}

const config = result.success ? result.data : {
  SMTP_HOST: 'smtp.zoho.com',
  SMTP_PORT: 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: 'contact@AlMaghribacademy.co',
  ADMIN_EMAIL: 'contact@AlMaghribacademy.co',
  NODE_ENV: 'development',
};

// ============================================
// 3. INPUT VALIDATION SCHEMA
// ============================================
const teacherApplicationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email address'),
  countryCode: z.string().min(1, 'Country code is required'),
  mobile: z.string().min(5, 'Mobile number must be at least 5 characters').max(20),
  country: z.string().min(1, 'Country is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  aboutMe: z.string().min(20, 'About Me must be at least 20 characters').max(2000),
  facebookProfile: z.string().url('Invalid Facebook URL').optional().or(z.string().max(0)),
  education: z.string().min(1, 'Education is required'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  motherLanguage: z.string().min(1, 'Mother language is required'),
  otherLanguage: z.string().optional(),
});

// ============================================
// 4. HELPER FUNCTION: Get Client IP
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
// 5. SIMPLE IN-MEMORY RATE LIMITING
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 applications per hour per IP

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
// 6. EMAIL TRANSPORTER
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

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// ============================================
// 7. FILE UPLOAD HELPERS
// ============================================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm'];

function validateFile(file: File | null, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: true }; // File is optional
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  return { valid: true };
}

async function saveFile(file: File | null, prefix: string, firstName: string, lastName: string, uploadDir: string): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const sanitizedFirstName = firstName.replace(/[^a-zA-Z0-9]/g, '');
  const sanitizedLastName = lastName.replace(/[^a-zA-Z0-9]/g, '');
  const filename = `${prefix}_${timestamp}_${sanitizedFirstName}_${sanitizedLastName}${ext}`;
  const filePath = `/uploads/teacher-applications/${filename}`;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);
  
  return filePath;
}

// ============================================
// 8. MAIN POST HANDLER
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
          message: 'Too many applications. Please try again later.',
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

    // Parse Form Data
    const formData = await request.formData();

    // Extract all fields
    const rawData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      gender: formData.get('gender') as string,
      email: formData.get('email') as string,
      countryCode: formData.get('countryCode') as string,
      mobile: formData.get('mobile') as string,
      country: formData.get('country') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      maritalStatus: formData.get('maritalStatus') as string,
      nationality: formData.get('nationality') as string,
      occupation: formData.get('occupation') as string,
      aboutMe: formData.get('aboutMe') as string,
      facebookProfile: formData.get('facebookProfile') as string || '',
      education: formData.get('education') as string,
      yearsOfExperience: formData.get('yearsOfExperience') as string,
      motherLanguage: formData.get('motherLanguage') as string,
      otherLanguage: formData.get('otherLanguage') as string || '',
    };

    // Validate required fields
    const validatedData = teacherApplicationSchema.parse(rawData);

    // Check for duplicate application (same email within 24 hours)
    const existingApplication = await prisma.teacherApplication.findFirst({
      where: {
        email: validatedData.email.toLowerCase().trim(),
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already submitted an application within the last 24 hours. Please wait before applying again.',
        },
        { status: 429 }
      );
    }

    // Get Files
    const profileImage = formData.get('profileImage') as File | null;
    const cv = formData.get('cv') as File | null;
    const audio = formData.get('audio') as File | null;

    // Validate Files
    const imageValidation = validateFile(profileImage, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, message: `Profile Image: ${imageValidation.error}` },
        { status: 400 }
      );
    }

    const cvValidation = validateFile(cv, ALLOWED_DOC_TYPES, MAX_FILE_SIZE);
    if (!cvValidation.valid) {
      return NextResponse.json(
        { success: false, message: `CV: ${cvValidation.error}` },
        { status: 400 }
      );
    }

    const audioValidation = validateFile(audio, ALLOWED_AUDIO_TYPES, MAX_FILE_SIZE);
    if (!audioValidation.valid) {
      return NextResponse.json(
        { success: false, message: `Audio: ${audioValidation.error}` },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'teacher-applications');
    await mkdir(uploadDir, { recursive: true });

    // Save Files
    const [profileImagePath, cvPath, audioPath] = await Promise.all([
      saveFile(profileImage, 'profile', validatedData.firstName, validatedData.lastName, uploadDir),
      saveFile(cv, 'cv', validatedData.firstName, validatedData.lastName, uploadDir),
      saveFile(audio, 'audio', validatedData.firstName, validatedData.lastName, uploadDir),
    ]);

    // Get User Agent
    const userAgent = request.headers.get('user-agent') || 'Not recorded';

    // Save to Database
    const application = await prisma.teacherApplication.create({
      data: {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        gender: validatedData.gender,
        email: validatedData.email.toLowerCase().trim(),
        countryCode: validatedData.countryCode,
        mobile: validatedData.mobile.trim(),
        country: validatedData.country,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        maritalStatus: validatedData.maritalStatus,
        nationality: validatedData.nationality,
        occupation: validatedData.occupation,
        aboutMe: validatedData.aboutMe.trim(),
        facebookProfile: validatedData.facebookProfile.trim() || null,
        profileImage: profileImagePath,
        education: validatedData.education,
        experience: validatedData.yearsOfExperience,
        motherLanguage: validatedData.motherLanguage,
        otherLanguage: validatedData.otherLanguage.trim() || null,
        cvFilePath: cvPath,
        audioFilePath: audioPath,
        ipAddress: ip,
        userAgent,
        status: 'pending',
      },
    });

    // Send emails (asynchronously)
    sendEmails({
      firstName: validatedData.firstName.trim(),
      lastName: validatedData.lastName.trim(),
      email: validatedData.email.toLowerCase().trim(),
      gender: validatedData.gender,
      mobile: validatedData.mobile.trim(),
      country: validatedData.country,
      dateOfBirth: validatedData.dateOfBirth,
      maritalStatus: validatedData.maritalStatus,
      nationality: validatedData.nationality,
      occupation: validatedData.occupation,
      aboutMe: validatedData.aboutMe.trim(),
      facebookProfile: validatedData.facebookProfile.trim() || null,
      education: validatedData.education,
      yearsOfExperience: validatedData.yearsOfExperience,
      motherLanguage: validatedData.motherLanguage,
      otherLanguage: validatedData.otherLanguage.trim() || null,
      applicationId: application.id.toString(),
    }).catch(emailError => {
      console.error('Background email sending failed:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        applicationId: application.id.toString(),
        email: validatedData.email,
      });
    });

    console.log('Teacher application submitted successfully:', {
      applicationId: application.id.toString(),
      email: validatedData.email,
      ip,
      duration: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json({
      success: true,
      message: 'Your application has been submitted successfully. We will review it within 2-3 business days.',
      data: {
        id: application.id,
        reference: `#${application.id}`,
      },
    });

  } catch (error) {
    console.error('Teacher registration error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${Date.now() - startTime}ms`,
    });

    if (error instanceof z.ZodError) {
      const errorArray = (error as any).issues || (error as any).errors || [];
      const formattedErrors = errorArray.map((err: any) => ({
        field: err.path?.join('.') || err.path || 'unknown',
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
        message: 'Failed to submit application. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// ============================================
// 9. EMAIL SENDING FUNCTION
// ============================================
async function sendEmails(data: {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  mobile: string;
  country: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  occupation: string;
  aboutMe: string;
  facebookProfile: string | null;
  education: string;
  yearsOfExperience: string;
  motherLanguage: string;
  otherLanguage: string | null;
  applicationId: string;
}) {
  const {
    firstName,
    lastName,
    email,
    gender,
    mobile,
    country,
    dateOfBirth,
    maritalStatus,
    nationality,
    occupation,
    aboutMe,
    facebookProfile,
    education,
    yearsOfExperience,
    motherLanguage,
    otherLanguage,
    applicationId,
  } = data;

  const fullName = `${firstName} ${lastName}`;
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
  // APPLICANT EMAIL (Thank You)
  // ============================================
  const applicantEmailHtml = `
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
          padding: 15px 20px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center;
          border: 1px solid #a5d6a7;
        }
        .reference-box strong { 
          font-size: 16px; 
          color: #0a2e7a; 
        }
        .summary-box { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 15px 0; 
        }
        .summary-box p { 
          margin: 5px 0; 
        }
        .steps { 
          padding-left: 20px; 
        }
        .steps li { 
          margin-bottom: 8px; 
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
          <h1>🕌 Thank You for Applying!</h1>
          <p>AlMaghrib Academy - Teacher Application Received</p>
        </div>
        <div class="content">
          <h2>Dear ${escapeHtml(fullName)},</h2>
          <p>Thank you for applying to become a teacher at <strong>AlMaghrib Academy</strong>. We appreciate your interest in joining our team.</p>
          
          <p>We have received your application and our team will review it carefully. A member of our HR team will connect with you within <strong>2-3 business days</strong>.</p>
          
          <div class="reference-box">
            <strong>📌 Your Application Reference Number: #${applicationId}</strong>
          </div>

          <h3>Application Summary:</h3>
          <div class="summary-box">
            <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Education:</strong> ${escapeHtml(education)}</p>
            <p><strong>Experience:</strong> ${escapeHtml(yearsOfExperience)}</p>
          </div>

          <p style="margin-top: 20px;">What happens next?</p>
          <ol class="steps">
            <li>📋 Our team will review your application</li>
            <li>📞 We may contact you for an interview</li>
            <li>✅ You'll receive a decision within 2-3 business days</li>
          </ol>

          <div style="text-align: center; margin: 30px 0 10px;">
            <a href="https://AlMaghribacademy.co" class="btn">Visit Our Website</a>
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
          min-width: 130px; 
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
        .about-box { 
          background: #ffffff; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 10px 0; 
          border: 1px solid #e9ecef;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .actions { 
          display: flex; 
          gap: 10px; 
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
          <h1>📨 New Teacher Application</h1>
          <p>AlMaghrib Academy - Teacher Registration</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ Action Required:</strong> A new teacher application has been submitted and requires review.
          </div>

          <h2>Personal Information</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Application #:</span>
              <span class="detail-value"><strong>${applicationId}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value"><strong>${escapeHtml(fullName)}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Gender:</span>
              <span class="detail-value">${escapeHtml(gender)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value"><a href="tel:${mobile}">${mobile}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Country:</span>
              <span class="detail-value">${escapeHtml(country)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nationality:</span>
              <span class="detail-value">${escapeHtml(nationality)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date of Birth:</span>
              <span class="detail-value">${new Date(dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Marital Status:</span>
              <span class="detail-value">${escapeHtml(maritalStatus)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Occupation:</span>
              <span class="detail-value">${escapeHtml(occupation)}</span>
            </div>
          </div>

          <h2>Qualifications</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Education:</span>
              <span class="detail-value">${escapeHtml(education)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Experience:</span>
              <span class="detail-value">${escapeHtml(yearsOfExperience)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mother Language:</span>
              <span class="detail-value">${escapeHtml(motherLanguage)}</span>
            </div>
            ${otherLanguage ? `
            <div class="detail-row">
              <span class="detail-label">Other Language:</span>
              <span class="detail-value">${escapeHtml(otherLanguage)}</span>
            </div>
            ` : ''}
          </div>

          <h2>About Me</h2>
          <div class="about-box">${escapeHtml(aboutMe)}</div>

          ${facebookProfile ? `
          <h2>Social Links</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Facebook:</span>
              <span class="detail-value"><a href="${facebookProfile}" target="_blank">${facebookProfile}</a></span>
            </div>
          </div>
          ` : ''}

          <h2>Quick Actions</h2>
          <div class="actions">
            <a href="mailto:${email}" class="btn btn-reply">📧 Email</a>
            <a href="tel:${mobile}" class="btn btn-call">📞 Call</a>
            <a href="https://AlMaghribacademy.co/admin/teachers/${applicationId}" class="btn btn-dashboard">📊 Dashboard</a>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>📌 Note:</strong> Please review this application and contact the applicant within 2-3 business days.
          </div>

          <div style="font-size: 12px; color: #888; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
            <p><strong>Received:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${currentYear} AlMaghrib Academy. All rights reserved.</p>
          <p>This is an automated notification from your website.</p>
        </div>
      </div>
    </body>
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

    // Send Applicant Email
    await sendWithRetry({
      from: `"AlMaghrib Academy" <${fromEmail}>`,
      to: email,
      subject: `Thank You for Applying - AlMaghrib Academy Teacher Position #${applicationId}`,
      html: applicantEmailHtml,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });
    console.log('Applicant email sent successfully to:', email);

    // Send Admin Email
    await sendWithRetry({
      from: `"AlMaghrib Academy Website" <${fromEmail}>`,
      to: adminEmail,
      subject: `📨 New Teacher Application from ${fullName} - #${applicationId}`,
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
      applicationId,
      email,
      adminEmail,
    });
  }
}

// ============================================
// 10. OPTIONS HANDLER (CORS)
// ============================================
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': 'https://AlMaghribacademy.co',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}