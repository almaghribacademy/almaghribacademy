// app/api/teacher-registration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

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
  SMTP_FROM: z.string().email().default('contact@almaghrib.academy'),
  ADMIN_EMAIL: z.string().email().default('contact@almaghrib.academy'),
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
  SMTP_FROM: 'contact@almaghrib.academy',
  ADMIN_EMAIL: 'contact@almaghrib.academy',
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
  facebookProfile: z.string().optional().default(''),
  education: z.string().min(1, 'Education is required'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  motherLanguage: z.string().min(1, 'Mother language is required'),
  otherLanguage: z.string().optional().default(''),
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
const RATE_LIMIT_MAX_REQUESTS = 3;

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
// 7. MAIN POST HANDLER WITH CLOUDINARY
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
      facebookProfile: (formData.get('facebookProfile') as string) || '',
      education: formData.get('education') as string,
      yearsOfExperience: formData.get('yearsOfExperience') as string,
      motherLanguage: formData.get('motherLanguage') as string,
      otherLanguage: (formData.get('otherLanguage') as string) || '',
    };

    // Validate required fields
    const validatedData = teacherApplicationSchema.parse(rawData);

    // ============================================
    // REMOVED: Duplicate email check
    // Now allowing multiple applications from same email
    // ============================================
    
    // We'll still check for excessive submissions (spam protection)
    const recentApplications = await prisma.teacherApplication.count({
      where: {
        email: validatedData.email.toLowerCase().trim(),
        ipAddress: ip,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    // Allow up to 3 applications per IP per day
    if (recentApplications >= 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many applications from this IP address. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Get Files
    const profileImage = formData.get('profileImage') as File | null;
    const cv = formData.get('cv') as File | null;
    const audio = formData.get('audio') as File | null;

    // Validate required files
    if (!profileImage) {
      return NextResponse.json(
        { success: false, message: 'Profile image is required' },
        { status: 400 }
      );
    }

    if (!cv) {
      return NextResponse.json(
        { success: false, message: 'CV is required' },
        { status: 400 }
      );
    }

    // Validate file sizes and types
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/m4a'];

    if (profileImage.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Profile image must be less than 10MB' },
        { status: 400 }
      );
    }

    if (!validImageTypes.includes(profileImage.type)) {
      return NextResponse.json(
        { success: false, message: 'Profile image must be JPG, PNG, or GIF' },
        { status: 400 }
      );
    }

    if (cv.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'CV must be less than 10MB' },
        { status: 400 }
      );
    }

    if (!validDocTypes.includes(cv.type)) {
      return NextResponse.json(
        { success: false, message: 'CV must be PDF, DOC, or DOCX' },
        { status: 400 }
      );
    }

    if (audio && audio.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Audio file must be less than 10MB' },
        { status: 400 }
      );
    }

    if (audio && !validAudioTypes.includes(audio.type)) {
      return NextResponse.json(
        { success: false, message: 'Audio must be MP3, WAV, or M4A' },
        { status: 400 }
      );
    }

    // ============================================
    // UPLOAD TO CLOUDINARY
    // ============================================
    const uploadPromises: Promise<any>[] = [];
    const uploadResults: { [key: string]: string } = {};
    const publicIds: { [key: string]: string } = {};

    // Upload Profile Image
    console.log('📤 Uploading profile image to Cloudinary...');
    uploadPromises.push(
      uploadToCloudinary(profileImage, 'profiles', 'image')
        .then(result => {
          uploadResults.profileImage = result.secure_url;
          publicIds.profileImage = result.public_id;
          console.log('✅ Profile image uploaded:', result.secure_url);
        })
        .catch(error => {
          console.error('❌ Failed to upload profile image:', error);
          throw new Error('Failed to upload profile image to Cloudinary');
        })
    );

    // Upload CV (as raw file)
    console.log('📤 Uploading CV to Cloudinary...');
    uploadPromises.push(
      uploadToCloudinary(cv, 'resumes', 'raw')
        .then(result => {
          uploadResults.cv = result.secure_url;
          publicIds.cv = result.public_id;
          console.log('✅ CV uploaded:', result.secure_url);
        })
        .catch(error => {
          console.error('❌ Failed to upload CV:', error);
          throw new Error('Failed to upload CV to Cloudinary');
        })
    );

    // Upload Audio (if provided)
    if (audio) {
      console.log('📤 Uploading audio to Cloudinary...');
      uploadPromises.push(
        uploadToCloudinary(audio, 'audio', 'video') // Use 'video' for audio files
          .then(result => {
            uploadResults.audio = result.secure_url;
            publicIds.audio = result.public_id;
            console.log('✅ Audio uploaded:', result.secure_url);
          })
          .catch(error => {
            console.error('❌ Failed to upload audio:', error);
            // Don't fail the whole request if audio upload fails
            console.warn('Audio upload failed, but continuing...');
          })
      );
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Get User Agent
    const userAgent = request.headers.get('user-agent') || 'Not recorded';

    // ============================================
    // SAVE TO DATABASE
    // ============================================
    const application = await prisma.teacherApplication.create({
      data: {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        gender: validatedData.gender,
        email: validatedData.email.toLowerCase().trim(), // No unique constraint anymore
        countryCode: validatedData.countryCode,
        mobile: validatedData.mobile.trim(),
        country: validatedData.country,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        maritalStatus: validatedData.maritalStatus,
        nationality: validatedData.nationality,
        occupation: validatedData.occupation,
        aboutMe: validatedData.aboutMe.trim(),
        facebookProfile: validatedData.facebookProfile.trim() || null,
        // Cloudinary URLs
        profileImage: uploadResults.profileImage,
        education: validatedData.education,
        experience: validatedData.yearsOfExperience,
        motherLanguage: validatedData.motherLanguage,
        otherLanguage: validatedData.otherLanguage.trim() || null,
        cvFilePath: uploadResults.cv,
        audioFilePath: uploadResults.audio || null,
        ipAddress: ip,
        userAgent,
        status: 'pending',
      },
    });

    // ============================================
    // SEND EMAILS
    // ============================================
    await sendEmails({
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
      profileImageUrl: uploadResults.profileImage,
      cvUrl: uploadResults.cv,
      audioUrl: uploadResults.audio || null,
    }).catch(emailError => {
      console.error('Background email sending failed:', emailError);
    });

    console.log('✅ Teacher application submitted successfully:', {
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
        profileImageUrl: uploadResults.profileImage,
        cvUrl: uploadResults.cv,
        audioUrl: uploadResults.audio || null,
      },
    });

  } catch (error) {
    console.error('❌ Teacher registration error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${Date.now() - startTime}ms`,
    });

    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
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
// 8. EMAIL SENDING FUNCTION
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
  profileImageUrl: string;
  cvUrl: string;
  audioUrl: string | null;
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
    profileImageUrl,
    cvUrl,
    audioUrl,
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

  // Applicant Email
  const applicantEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; padding: 0; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0a2e7a 0%, #1a4a9a 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 35px 30px; }
        .content h2 { color: #0a2e7a; margin-top: 0; }
        .reference-box { background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 15px 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 1px solid #a5d6a7; }
        .reference-box strong { font-size: 16px; color: #0a2e7a; }
        .summary-box { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0; }
        .summary-box p { margin: 5px 0; }
        .btn { display: inline-block; padding: 12px 32px; background: #0a2e7a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; padding: 25px 30px; color: #888; font-size: 13px; border-top: 1px solid #eee; background: #fafafa; }
        .footer a { color: #0a2e7a; text-decoration: none; }
        @media (max-width: 480px) { .header { padding: 30px 20px; } .content { padding: 25px 20px; } }
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
          <ol>
            <li>📋 Our team will review your application</li>
            <li>📞 We may contact you for an interview</li>
            <li>✅ You'll receive a decision within 2-3 business days</li>
          </ol>

          <div style="text-align: center; margin: 30px 0 10px;">
            <a href="https://almaghrib.academy" class="btn">Visit Our Website</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${currentYear} AlMaghrib Academy. All rights reserved.</p>
          <p>Contact: <a href="mailto:${adminEmail}">${adminEmail}</a> | Phone: +44 7700 181874</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Admin Email
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; padding: 0; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0a2e7a 0%, #1a4a9a 100%); color: white; padding: 35px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .alert { background: #fff3cd; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px; }
        .details { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0; }
        .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; align-items: flex-start; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; min-width: 130px; color: #555; flex-shrink: 0; }
        .detail-value { flex: 1; word-break: break-word; }
        .about-box { background: #ffffff; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #e9ecef; white-space: pre-wrap; font-family: inherit; }
        .file-link { display: inline-block; padding: 8px 16px; background: #0a2e7a; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; margin: 2px 0; }
        .btn { display: inline-block; padding: 10px 24px; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
        .btn-reply { background: #28a745; }
        .btn-call { background: #17a2b8; }
        .footer { text-align: center; padding: 20px 30px; color: #888; font-size: 13px; border-top: 1px solid #eee; background: #fafafa; }
        @media (max-width: 480px) { .detail-row { flex-direction: column; } .detail-label { min-width: auto; margin-bottom: 2px; } }
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
            <div class="detail-row"><span class="detail-label">Application #:</span><span class="detail-value"><strong>${applicationId}</strong></span></div>
            <div class="detail-row"><span class="detail-label">Full Name:</span><span class="detail-value"><strong>${escapeHtml(fullName)}</strong></span></div>
            <div class="detail-row"><span class="detail-label">Gender:</span><span class="detail-value">${escapeHtml(gender)}</span></div>
            <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value"><a href="mailto:${email}">${email}</a></span></div>
            <div class="detail-row"><span class="detail-label">Mobile:</span><span class="detail-value"><a href="tel:${mobile}">${mobile}</a></span></div>
            <div class="detail-row"><span class="detail-label">Country:</span><span class="detail-value">${escapeHtml(country)}</span></div>
            <div class="detail-row"><span class="detail-label">Nationality:</span><span class="detail-value">${escapeHtml(nationality)}</span></div>
            <div class="detail-row"><span class="detail-label">Date of Birth:</span><span class="detail-value">${new Date(dateOfBirth).toLocaleDateString()}</span></div>
            <div class="detail-row"><span class="detail-label">Marital Status:</span><span class="detail-value">${escapeHtml(maritalStatus)}</span></div>
            <div class="detail-row"><span class="detail-label">Occupation:</span><span class="detail-value">${escapeHtml(occupation)}</span></div>
          </div>

          <h2>Qualifications</h2>
          <div class="details">
            <div class="detail-row"><span class="detail-label">Education:</span><span class="detail-value">${escapeHtml(education)}</span></div>
            <div class="detail-row"><span class="detail-label">Experience:</span><span class="detail-value">${escapeHtml(yearsOfExperience)}</span></div>
            <div class="detail-row"><span class="detail-label">Mother Language:</span><span class="detail-value">${escapeHtml(motherLanguage)}</span></div>
            ${otherLanguage ? `<div class="detail-row"><span class="detail-label">Other Language:</span><span class="detail-value">${escapeHtml(otherLanguage)}</span></div>` : ''}
          </div>

          <h2>About Me</h2>
          <div class="about-box">${escapeHtml(aboutMe)}</div>

          <h2>📎 Uploaded Files</h2>
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Profile Image:</span>
              <span class="detail-value">
                <a href="${profileImageUrl}" target="_blank" class="file-link">🖼️ View Image</a>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">CV:</span>
              <span class="detail-value">
                <a href="${cvUrl}" target="_blank" class="file-link">📄 Download CV</a>
              </span>
            </div>
            ${audioUrl ? `
            <div class="detail-row">
              <span class="detail-label">Audio Sample:</span>
              <span class="detail-value">
                <a href="${audioUrl}" target="_blank" class="file-link">🎵 Listen Audio</a>
              </span>
            </div>
            ` : ''}
          </div>

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
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
            <a href="mailto:${email}" class="btn btn-reply">📧 Email</a>
            <a href="tel:${mobile}" class="btn btn-call">📞 Call</a>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>📌 Note:</strong> Please review this application and contact the applicant within 2-3 business days.
          </div>
        </div>
        <div class="footer">
          <p>© ${currentYear} AlMaghrib Academy. All rights reserved.</p>
          <p>This is an automated notification from your website.</p>
        </div>
      </div>
    </html>
  `;

  // Send emails
  try {
    await transporter.verify();

    // Send Applicant Email
    await transporter.sendMail({
      from: `"AlMaghrib Academy" <${fromEmail}>`,
      to: email,
      subject: `Thank You for Applying - AlMaghrib Academy Teacher Position #${applicationId}`,
      html: applicantEmailHtml,
    });

    // Send Admin Email
    await transporter.sendMail({
      from: `"AlMaghrib Academy Website" <${fromEmail}>`,
      to: adminEmail,
      subject: `📨 New Teacher Application from ${fullName} - #${applicationId}`,
      html: adminEmailHtml,
    });

    console.log('✅ Emails sent successfully');
  } catch (emailError) {
    console.error('❌ Email sending error:', emailError);
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
        'Access-Control-Allow-Origin': 'https://almaghrib.academy',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}