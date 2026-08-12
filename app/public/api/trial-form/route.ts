import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// ============================================
// EMAIL TEMPLATES
// ============================================

const getAdminTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Trial Booking</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <tr>
      <td style="background: #0a2e7a; padding: 30px 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🕌 New Trial Class Booking</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">AlMaghrib Academy</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 40px;">
        <h2 style="color: #0a2e7a; margin-top: 0;">Student Details</h2>
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="font-weight: 600; color: #0a2e7a; width: 40%;">Full Name</td>
            <td style="color: #333;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #0a2e7a;">Email</td>
            <td style="color: #333;"><a href="mailto:${data.email}" style="color: #ff1493;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #0a2e7a;">Phone</td>
            <td style="color: #333;">${data.phone}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #0a2e7a;">Country</td>
            <td style="color: #333;">${data.country}</td>
          </tr>
          ${data.course ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Course</td><td style="color: #333;">${data.course}</td></tr>` : ''}
          ${data.session ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Session</td><td style="color: #333;">${data.session}</td></tr>` : ''}
          ${data.teacher ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Teacher</td><td style="color: #333;">${data.teacher}</td></tr>` : ''}
          ${data.preferredDate ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Preferred Date</td><td style="color: #333;">${data.preferredDate}</td></tr>` : ''}
          ${data.preferredTime ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Preferred Time</td><td style="color: #333;">${data.preferredTime}</td></tr>` : ''}
          ${data.source ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Source</td><td style="color: #333;">${data.source}</td></tr>` : ''}
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #ff1493;">
          <p style="margin: 0; color: #0a2e7a; font-size: 14px;">
            📌 <strong>Action Required:</strong> Contact the student within 24 hours to schedule their trial class.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          © ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getStudentTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Class Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <tr>
      <td style="background: #0a2e7a; padding: 30px 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Trial Class Confirmed</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">AlMaghrib Academy</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 40px;">
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Thank you for booking a free trial class with <strong>AlMaghrib Academy</strong>! 
          We're excited to begin your Quran learning journey.
        </p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0a2e7a; margin-top: 0;">📋 Booking Summary</h3>
          <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr><td style="font-weight: 600; color: #0a2e7a;">Course</td><td style="color: #333;">${data.course || 'Trial Class'}</td></tr>
            ${data.preferredDate ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Preferred Date</td><td style="color: #333;">${data.preferredDate}</td></tr>` : ''}
            ${data.preferredTime ? `<tr><td style="font-weight: 600; color: #0a2e7a;">Preferred Time</td><td style="color: #333;">${data.preferredTime}</td></tr>` : ''}
          </table>
        </div>
        <div style="background: #f0f7ff; padding: 16px; border-radius: 8px; border-left: 4px solid #ff1493; margin: 20px 0;">
          <p style="margin: 0; color: #0a2e7a; font-size: 14px;">
            📞 <strong>Next Steps:</strong> Our academic advisor will contact you within <strong>24 hours</strong> 
            to schedule your trial class and answer any questions.
          </p>
        </div>
        <div style="margin: 24px 0; padding: 20px; background: #fffbff; border-radius: 8px; border: 1px solid rgba(255,20,147,0.1);">
          <p style="margin: 0 0 12px; color: #0a2e7a; font-weight: 600;">📌 Important Information</p>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            <li>You'll need a stable internet connection and a device with camera/microphone</li>
            <li>Classes are conducted via Zoom or our secure learning portal</li>
            <li>You can reschedule by contacting our support team 24 hours in advance</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://AlMaghribacademy.com/contact" style="display: inline-block; padding: 12px 32px; background: #ff1493; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600;">
            Contact Support
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          © ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.
        </p>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">
          📧 ${data.email} | 📞 ${data.phone}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ============================================
// VALIDATION FUNCTION
// ============================================

const validateForm = (data: any) => {
  const errors: string[] = [];

  if (!data.firstName?.trim()) errors.push("First name is required");
  if (!data.lastName?.trim()) errors.push("Last name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  if (!data.phone?.trim()) errors.push("Phone number is required");
  if (!data.country?.trim()) errors.push("Country is required");

  return errors;
};

// ============================================
// CREATE TRANSPORTER
// ============================================

const createTransporter = () => {
  const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing SMTP environment variables: ${missing.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT!),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
};

// ============================================
// VERIFY CAPTCHA
// ============================================

const verifyCaptcha = async (token: string): Promise<boolean> => {
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY || "",
          response: token,
        }),
      }
    );

    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
};

// ============================================
// MAIN POST HANDLER
// ============================================

export async function POST(req: Request) {
  try {
    // Parse request body
    const data = await req.json();

    // Validate required fields
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Verify Turnstile captcha
    const isCaptchaValid = await verifyCaptcha(data.captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Captcha verification failed. Please try again.",
        },
        { status: 400 }
      );
    }

    // Create and verify transporter
    const transporter = createTransporter();
    await transporter.verify();

    // Get receiver email
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
    if (!receiverEmail) {
      throw new Error("CONTACT_RECEIVER_EMAIL is not set");
    }

    // Prepare email data
    const sanitizedData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      country: data.country.trim(),
      course: data.course || '-',
      session: data.session || '-',
      teacher: data.teacher || '-',
      source: data.source || '-',
      preferredDate: data.preferredDate || '-',
      preferredTime: data.preferredTime || '-',
    };

    // Send admin email
    const adminMail = await transporter.sendMail({
      from: `"AlMaghrib Academy" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      replyTo: sanitizedData.email,
      subject: `New Trial Booking - ${sanitizedData.firstName} ${sanitizedData.lastName}`,
      html: getAdminTemplate(sanitizedData),
    });

    // Send student confirmation email
    const studentMail = await transporter.sendMail({
      from: `"AlMaghrib Academy" <${process.env.EMAIL_USER}>`,
      to: sanitizedData.email,
      subject: "✅ Trial Session Confirmed - AlMaghrib Academy",
      html: getStudentTemplate(sanitizedData),
    });

    console.log("📧 Emails sent successfully:", {
      admin: adminMail.messageId,
      student: studentMail.messageId,
      studentEmail: sanitizedData.email,
    });

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully! We'll contact you within 24 hours.",
    });

  } catch (error: any) {
    console.error("❌ API Error:", error.message);

    // Return user-friendly error
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit booking. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}