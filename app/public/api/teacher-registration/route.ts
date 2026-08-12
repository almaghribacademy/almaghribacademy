import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ============================================
// TYPES
// ============================================

interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  gender: string;
  education: string;
  experience: string;
  motherLanguage: string;
  otherLanguage: string;
  about: string;
  cv: File | null;
  audio: File | null;
  captchaToken: string;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

const getAdminEmailHTML = (data: TeacherFormData, applicationDate: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Teacher Application</title>
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;max-width:900px;margin:auto;background:#f8f9fc;border-radius:12px;">
  <div style="background:#0a2e7a;padding:25px;border-radius:12px 12px 0 0;color:#fff;text-align:center;">
    <h1 style="margin:0;font-size:28px;">🎓 New Teacher Application</h1>
    <p style="margin:5px 0 0;opacity:0.9;">Submitted on ${applicationDate}</p>
  </div>
  
  <div style="background:#ffffff;padding:30px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;">
      ${createInfoCard("Full Name", `${data.firstName} ${data.lastName}`, "#0a2e7a")}
      ${createInfoCard("Email Address", `<a href="mailto:${data.email}" style="color:#0a2e7a;text-decoration:none;">${data.email}</a>`, "#0a2e7a")}
      ${createInfoCard("Mobile Number", data.mobile, "#0a2e7a")}
      ${createInfoCard("Country", data.country, "#0a2e7a")}
      ${createInfoCard("Gender", data.gender, "#0a2e7a")}
      ${createInfoCard("Application Date", applicationDate, "#0a2e7a")}
    </div>

    <h3 style="color:#0a2e7a;border-bottom:2px solid #f0f4ff;padding-bottom:10px;margin-top:30px;">📚 Qualifications & Experience</h3>
    <table cellpadding="12" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr style="background:#f8f9fc;">
        <td style="font-weight:600;width:40%;border:1px solid #e5e7eb;padding:10px;">Education</td>
        <td style="border:1px solid #e5e7eb;padding:10px;">${data.education || "N/A"}</td>
      </tr>
      <tr>
        <td style="font-weight:600;border:1px solid #e5e7eb;padding:10px;">Teaching Experience</td>
        <td style="border:1px solid #e5e7eb;padding:10px;">${data.experience || "N/A"}</td>
      </tr>
      <tr style="background:#f8f9fc;">
        <td style="font-weight:600;border:1px solid #e5e7eb;padding:10px;">Mother Language</td>
        <td style="border:1px solid #e5e7eb;padding:10px;">${data.motherLanguage || "N/A"}</td>
      </tr>
      <tr>
        <td style="font-weight:600;border:1px solid #e5e7eb;padding:10px;">Other Languages</td>
        <td style="border:1px solid #e5e7eb;padding:10px;">${data.otherLanguage || "N/A"}</td>
      </tr>
    </table>

    <h3 style="color:#0a2e7a;border-bottom:2px solid #f0f4ff;padding-bottom:10px;margin-top:30px;">💬 About the Applicant</h3>
    <div style="background:#f8f9fc;padding:20px;border-radius:8px;border-left:4px solid #ff1493;margin-bottom:20px;">
      ${data.about || "N/A"}
    </div>

    <div style="background:#f0f4ff;padding:15px;border-radius:8px;margin-top:20px;">
      <p style="margin:0;color:#0a2e7a;">
        <strong>📎 CV Attachment:</strong> ${data.cv ? "✅ Attached to this email" : "❌ Not provided"}<br>
        <strong>🎵 Audio Sample:</strong> ${data.audio ? "✅ Attached to this email" : "❌ Not provided"}
      </p>
    </div>

    <div style="margin-top:30px;padding:15px;background:#fff5f5;border-radius:8px;border:1px solid #ff149330;text-align:center;">
      <p style="margin:0;color:#ff1493;font-weight:600;">
        ⏳ Action Required: Please review this application and contact the teacher within 2-3 business days.
      </p>
    </div>
  </div>
</body>
</html>
`;

const getTeacherEmailHTML = (data: TeacherFormData, applicationDate: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;max-width:600px;margin:auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
  
  <div style="text-align:center;padding:20px 0;border-bottom:3px solid #0a2e7a;">
    <h1 style="color:#0a2e7a;margin:0;font-size:28px;">AlMaghrib Academy</h1>
    <p style="color:#888;margin:5px 0 0;">Learn with Excellence</p>
  </div>

  <div style="padding:30px 20px;">
    <div style="text-align:center;font-size:48px;margin-bottom:15px;">🎉</div>
    
    <h2 style="color:#0a2e7a;text-align:center;margin-bottom:10px;">Thank You for Applying!</h2>
    
    <p style="color:#555;font-size:16px;line-height:1.8;text-align:center;">
      Dear <strong>${data.firstName} ${data.lastName}</strong>,
    </p>

    <div style="background:#f0f4ff;padding:20px;border-radius:10px;margin:25px 0;border-left:4px solid #0a2e7a;">
      <p style="margin:0;color:#333;font-size:15px;line-height:1.8;">
        We have received your application to join <strong>AlMaghrib Academy</strong> as a teacher.
        Our team is excited to review your qualifications and experience.
      </p>
    </div>

    <div style="background:#fff8f0;padding:20px;border-radius:10px;margin:20px 0;border-left:4px solid #ff1493;">
      <h4 style="color:#ff1493;margin:0 0 10px;">📋 What's Next?</h4>
      <ul style="color:#555;line-height:2;padding-left:20px;margin:0;">
        <li>Our team will review your application within <strong>2-3 business days</strong></li>
        <li>We will contact you via email or phone for an interview</li>
        <li>If shortlisted, we'll schedule a demo teaching session</li>
      </ul>
    </div>

    <div style="background:#f8f9fc;padding:15px;border-radius:8px;margin:20px 0;text-align:center;">
      <p style="margin:0;color:#666;font-size:14px;">
        <strong>Application Reference:</strong> #AlMaghrib-${Date.now().toString().slice(-6)}
      </p>
      <p style="margin:5px 0 0;color:#888;font-size:13px;">
        Submitted on: ${applicationDate}
      </p>
    </div>

    <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:2px solid #f0f4ff;">
      <p style="color:#888;font-size:14px;line-height:1.8;margin:0;">
        For any questions, please contact us at:<br>
        <a href="mailto:contact@AlMaghribacademy.cc" style="color:#0a2e7a;font-weight:600;text-decoration:none;">
          contact@AlMaghribacademy.cc
        </a>
      </p>
    </div>

    <div style="margin-top:25px;padding:15px;background:#0a2e7a;border-radius:8px;text-align:center;">
      <p style="margin:0;color:#ffffff;font-size:14px;font-weight:500;">
        🌟 We look forward to potentially having you on our team!
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

const createInfoCard = (label: string, value: string, color: string) => `
  <div style="background:#f0f4ff;padding:15px;border-radius:8px;border-left:4px solid ${color};">
    <strong style="color:${color};display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">${label}</strong>
    <span style="font-size:16px;font-weight:500;">${value}</span>
  </div>
`;

const createTransporter = () => {
  const required = ['EMAIL_USER', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing SMTP environment variables: ${missing.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: "smtppro.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
};

const validateForm = (data: TeacherFormData): string[] => {
  const errors: string[] = [];

  if (!data.firstName?.trim()) errors.push("First name is required");
  if (!data.lastName?.trim()) errors.push("Last name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  if (!data.mobile?.trim()) errors.push("Mobile number is required");
  if (!data.country?.trim()) errors.push("Country is required");
  if (!data.gender) errors.push("Gender is required");

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

const processFile = async (file: File | null): Promise<{ buffer: Buffer | null; filename: string | null }> => {
  if (!file) return { buffer: null, filename: null };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    return { buffer, filename: sanitizedName };
  } catch {
    return { buffer: null, filename: null };
  }
};

// ============================================
// MAIN POST HANDLER
// ============================================

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    
    // Extract and validate data
    const data: TeacherFormData = {
      firstName: formData.get("firstName") as string || '',
      lastName: formData.get("lastName") as string || '',
      email: formData.get("email") as string || '',
      mobile: formData.get("mobile") as string || '',
      country: formData.get("country") as string || '',
      gender: formData.get("gender") as string || '',
      education: formData.get("education") as string || '',
      experience: formData.get("experience") as string || '',
      motherLanguage: formData.get("motherLanguage") as string || '',
      otherLanguage: formData.get("otherLanguage") as string || '',
      about: formData.get("about") as string || '',
      cv: formData.get("cv") as File | null,
      audio: formData.get("audio") as File | null,
      captchaToken: formData.get("captchaToken") as string || '',
    };

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

    // Process files
    const cvData = await processFile(data.cv);
    const audioData = await processFile(data.audio);

    // Create transporter
    const transporter = createTransporter();
    await transporter.verify();

    // Get application date
    const applicationDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // ============================================
    // 1. SEND ADMIN EMAIL
    // ============================================
    const adminMailOptions: any = {
      from: `"AlMaghrib Academy" <${process.env.EMAIL_USER}>`,
      to: "contact@AlMaghribacademy.cc",
      replyTo: data.email,
      subject: `📝 New Teacher Application - ${data.firstName} ${data.lastName}`,
      html: getAdminEmailHTML(data, applicationDate),
    };

    // Add attachments if they exist
    const attachments = [];
    if (cvData.buffer && cvData.filename) {
      attachments.push({
        filename: `${data.firstName}_${data.lastName}_CV_${Date.now()}_${cvData.filename}`,
        content: cvData.buffer,
      });
    }
    if (audioData.buffer && audioData.filename) {
      attachments.push({
        filename: `${data.firstName}_${data.lastName}_Audio_${Date.now()}_${audioData.filename}`,
        content: audioData.buffer,
      });
    }
    if (attachments.length > 0) {
      adminMailOptions.attachments = attachments;
    }

    await transporter.sendMail(adminMailOptions);

    // ============================================
    // 2. SEND TEACHER CONFIRMATION EMAIL
    // ============================================
    const teacherMailOptions = {
      from: `"AlMaghrib Academy" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "✅ Application Received - AlMaghrib Academy",
      html: getTeacherEmailHTML(data, applicationDate),
    };

    await transporter.sendMail(teacherMailOptions);

    // ============================================
    // 3. SUCCESS RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. Thank you for applying!",
    });

  } catch (error: any) {
    console.error("❌ Teacher Registration Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit application. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}