import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ============================================
// TYPES
// ============================================

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  captchaToken: string;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

const getAdminEmailHTML = (data: ContactFormData, submissionDate: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;max-width:700px;margin:auto;background:#f8f9fc;border-radius:12px;">
  <div style="background:#0a2e7a;padding:25px;border-radius:12px 12px 0 0;color:#fff;text-align:center;">
    <h1 style="margin:0;font-size:24px;">📧 New Contact Form Submission</h1>
    <p style="margin:5px 0 0;opacity:0.9;">Received on ${submissionDate}</p>
  </div>
  
  <div style="background:#ffffff;padding:30px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;">
      <div style="background:#f0f4ff;padding:15px;border-radius:8px;border-left:4px solid #0a2e7a;">
        <strong style="color:#0a2e7a;display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Full Name</strong>
        <span style="font-size:18px;font-weight:600;">${data.fullName}</span>
      </div>
      <div style="background:#f0f4ff;padding:15px;border-radius:8px;border-left:4px solid #0a2e7a;">
        <strong style="color:#0a2e7a;display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email Address</strong>
        <span style="font-size:16px;"><a href="mailto:${data.email}" style="color:#0a2e7a;text-decoration:none;">${data.email}</a></span>
      </div>
      <div style="background:#f0f4ff;padding:15px;border-radius:8px;border-left:4px solid #0a2e7a;">
        <strong style="color:#0a2e7a;display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Phone Number</strong>
        <span style="font-size:16px;font-weight:500;">${data.phone}</span>
      </div>
      <div style="background:#f0f4ff;padding:15px;border-radius:8px;border-left:4px solid #0a2e7a;">
        <strong style="color:#0a2e7a;display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Subject</strong>
        <span style="font-size:16px;font-weight:500;">${data.subject}</span>
      </div>
    </div>

    <h3 style="color:#0a2e7a;border-bottom:2px solid #f0f4ff;padding-bottom:10px;margin-top:30px;">💬 Message</h3>
    <div style="background:#f8f9fc;padding:20px;border-radius:8px;border-left:4px solid #ff1493;margin-bottom:20px;min-height:100px;">
      <p style="margin:0;color:#333;font-size:15px;line-height:1.8;white-space:pre-wrap;">${data.message}</p>
    </div>

    <div style="background:#f0f4ff;padding:15px;border-radius:8px;margin-top:20px;">
      <p style="margin:0;color:#0a2e7a;font-size:14px;">
        <strong>📅 Submitted:</strong> ${submissionDate}
      </p>
    </div>

    <div style="margin-top:20px;padding:15px;background:#fff5f5;border-radius:8px;border:1px solid #ff149330;text-align:center;">
      <p style="margin:0;color:#ff1493;font-weight:600;font-size:14px;">
        ⏳ Action Required: Please respond to this inquiry within 24 hours.
      </p>
    </div>
  </div>
</body>
</html>
`;

const getUserEmailHTML = (data: ContactFormData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We've Received Your Message</title>
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;max-width:600px;margin:auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
  
  <div style="text-align:center;padding:20px 0;border-bottom:3px solid #0a2e7a;">
    <h1 style="color:#0a2e7a;margin:0;font-size:28px;">AlMaghrib Academy</h1>
    <p style="color:#888;margin:5px 0 0;">Learn with Excellence</p>
  </div>

  <div style="padding:30px 20px;">
    <div style="text-align:center;font-size:48px;margin-bottom:15px;">📨</div>
    
    <h2 style="color:#0a2e7a;text-align:center;margin-bottom:10px;">Thank You for Contacting Us!</h2>
    
    <p style="color:#555;font-size:16px;line-height:1.8;text-align:center;">
      Dear <strong>${data.fullName}</strong>,
    </p>

    <div style="background:#f0f4ff;padding:20px;border-radius:10px;margin:25px 0;border-left:4px solid #0a2e7a;">
      <p style="margin:0;color:#333;font-size:15px;line-height:1.8;">
        Thank you for reaching out to <strong>AlMaghrib Academy</strong>. 
        We have received your message and will respond within <strong>24 hours</strong>.
      </p>
    </div>

    <div style="background:#f8f9fc;padding:20px;border-radius:10px;margin:20px 0;">
      <h4 style="color:#0a2e7a;margin:0 0 10px;">📋 Message Summary</h4>
      <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="font-weight:600;color:#0a2e7a;width:30%;">Subject</td>
          <td style="color:#333;">${data.subject}</td>
        </tr>
        <tr>
          <td style="font-weight:600;color:#0a2e7a;">Message</td>
          <td style="color:#333;font-size:14px;">${data.message.substring(0, 100)}${data.message.length > 100 ? '...' : ''}</td>
        </tr>
      </table>
    </div>

    <div style="background:#fff8f0;padding:20px;border-radius:10px;margin:20px 0;border-left:4px solid #ff1493;">
      <h4 style="color:#ff1493;margin:0 0 10px;">📌 What's Next?</h4>
      <ul style="color:#555;line-height:2;padding-left:20px;margin:0;">
        <li>Our team will review your message</li>
        <li>We'll respond via email within 24 hours</li>
        <li>You can also call us for urgent inquiries</li>
      </ul>
    </div>

    <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:2px solid #f0f4ff;">
      <p style="color:#888;font-size:14px;line-height:1.8;margin:0;">
        For urgent matters, please call us at:<br>
        <a href="tel:+447488848483" style="color:#0a2e7a;font-weight:600;text-decoration:none;">
          +44 7488 848483
        </a>
      </p>
    </div>

    <div style="margin-top:25px;padding:15px;background:#0a2e7a;border-radius:8px;text-align:center;">
      <p style="margin:0;color:#ffffff;font-size:14px;font-weight:500;">
        🌟 We look forward to helping you with your inquiry!
      </p>
    </div>
  </div>

  <div style="text-align:center;padding:20px;background:#f8f9fc;border-radius:0 0 12px 12px;border-top:2px solid #f0f4ff;">
    <p style="margin:0;color:#888;font-size:12px;">
      © ${new Date().getFullYear()} AlMaghrib Academy. All rights reserved.
    </p>
  </div>
</body>
</html>
`;

// ============================================
// HELPER FUNCTIONS
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
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
};

const validateForm = (data: ContactFormData): string[] => {
  const errors: string[] = [];

  if (!data.fullName?.trim()) errors.push("Full name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  if (!data.phone?.trim()) errors.push("Phone number is required");
  if (!data.subject?.trim()) errors.push("Subject is required");
  if (!data.message?.trim()) errors.push("Message is required");
  if (data.message && data.message.length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  return errors;
};

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

export async function POST(request: Request) {
  try {
    // Parse request body - ✅ FIXED: Only destructure once
    const data: ContactFormData = await request.json();

    // Extract individual fields from data
    const { fullName, email, phone, subject, message, captchaToken } = data;

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

    // Verify captcha
    const isCaptchaValid = await verifyCaptcha(captchaToken);
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

    // Get submission date
    const submissionDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // ============================================
    // 1. SEND ADMIN NOTIFICATION
    // ============================================
    const adminMailOptions = {
      from: `"AlMaghrib Academy" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `📧 Contact Form: ${subject} - ${fullName}`,
      html: getAdminEmailHTML(data, submissionDate),
    };

    await transporter.sendMail(adminMailOptions);

    // ============================================
    // 2. SEND USER CONFIRMATION
    // ============================================
    const userMailOptions = {
      from: `"AlMaghrib Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We've Received Your Message - AlMaghrib Academy",
      html: getUserEmailHTML(data),
    };

    await transporter.sendMail(userMailOptions);

    // ============================================
    // 3. SUCCESS RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,
      message: "Message sent successfully. We'll get back to you within 24 hours!",
    });

  } catch (error: any) {
    console.error("❌ Contact Form Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}