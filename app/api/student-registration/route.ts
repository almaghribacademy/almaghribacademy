import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Email configuration
import nodemailer from "nodemailer";

// ✅ FIXED: Zoho SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zoho.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // Zoho uses SSL on port 465
  auth: {
    user: process.env.SMTP_USER, // Your full Zoho email address
    pass: process.env.SMTP_PASS, // Your Zoho app password
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  // ✅ Add timeout settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// ✅ Verify transporter on startup
async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ SMTP verification failed:", error);
    return false;
  }
}

// ✅ Call this at startup
verifyTransporter();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      alternativePhone,
      country,
      gender,
      courseId,
      trialDate,
      preferredTime,
      ampm,
      hoursPerWeek,
      pricingPlan,
      preferredDays,
      courseName,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country || !courseId || !trialDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ CHECK IF EMAIL ALREADY EXISTS
    const existingStudent = await prisma.studentRegistration.findUnique({
      where: { email: email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { 
          message: "This email is already registered. Please use a different email address or contact us for assistance.",
          code: "EMAIL_EXISTS"
        },
        { status: 409 }
      );
    }

    // Generate student ID
    const generatedStudentId = `STU${Date.now().toString().slice(-8)}`;

    // Store in Supabase (PostgreSQL via Prisma)
    const registration = await prisma.studentRegistration.create({
      data: {
        studentId: generatedStudentId,
        firstName: firstName.slice(0, 50),
        lastName: lastName.slice(0, 50),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        email: email.slice(0, 100),
        phone: phone.slice(0, 20),
        alternativePhone: alternativePhone ? alternativePhone.slice(0, 20) : null,
        country: country.slice(0, 50),
        gender: gender ? gender.slice(0, 20) : null,
        courseId: courseId,
        trialDate: new Date(trialDate),
        status: "pending",
        notes: `Pricing Plan: ${pricingPlan}, Hours per week: ${hoursPerWeek}, Preferred days: ${preferredDays?.join(", ") || ""}, Preferred Time: ${preferredTime} ${ampm}`.slice(0, 1000),
      },
    });

    // ✅ Send emails with better error handling
    let emailErrors = [];
    
    try {
      await sendConfirmationEmail({
        firstName,
        lastName,
        email,
        courseName,
        hoursPerWeek,
        pricingPlan,
        preferredDays,
        trialDate,
        preferredTime,
        ampm,
        phone,
        country,
        generatedStudentId,
      });
    } catch (error) {
      console.error("❌ Confirmation email failed:", error);
      emailErrors.push("confirmation");
    }

    try {
      await sendAdminNotification({
        firstName,
        lastName,
        email,
        phone,
        alternativePhone,
        country,
        gender,
        courseName,
        hoursPerWeek,
        pricingPlan,
        preferredDays,
        trialDate,
        preferredTime,
        ampm,
        generatedStudentId,
      });
    } catch (error) {
      console.error("❌ Admin notification failed:", error);
      emailErrors.push("admin");
    }

    // ✅ Return success even if emails fail (registration is saved)
    return NextResponse.json(
      { 
        message: "Registration submitted successfully",
        data: registration,
        emailSent: emailErrors.length === 0,
        emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle Prisma errors
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as any;
      
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target || [];
        if (target.includes('email')) {
          return NextResponse.json(
            { 
              message: "This email is already registered. Please use a different email address or contact us for assistance.",
              code: "EMAIL_EXISTS"
            },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { 
            message: "A record with this information already exists.",
            code: "DUPLICATE_RECORD"
          },
          { status: 409 }
        );
      }
      
      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          { 
            message: "Invalid course selected. Please try again.",
            code: "INVALID_COURSE"
          },
          { status: 400 }
        );
      }
      
      if (prismaError.code === 'P2000') {
        return NextResponse.json(
          { 
            message: "One of the fields exceeds the maximum length. Please check your input.",
            code: "FIELD_TOO_LONG"
          },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        message: "Failed to submit registration. Please try again later.",
        code: "SERVER_ERROR"
      },
      { status: 500 }
    );
  }
}

// ---- Email Functions ----
async function sendConfirmationEmail(data: any) {
  const { firstName, lastName, email, courseName, hoursPerWeek, pricingPlan, preferredDays, trialDate, preferredTime, ampm, phone, country, generatedStudentId } = data;

  // ✅ Add debug logging
  console.log(`📧 Attempting to send confirmation email to: ${email}`);
  console.log(`📧 Using SMTP from: ${process.env.SMTP_FROM || "contact@AlMaghribacademy.co"}`);

  const mailOptions = {
    from: `"AlMaghrib Academy" <${process.env.SMTP_FROM || "contact@AlMaghribacademy.co"}>`,
    to: email,
    subject: "✅ Registration Confirmation - AlMaghrib Academy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://www.AlMaghribacademy.co/assets/images/only-logo.png" alt="AlMaghrib Academy" style="max-width: 80px;" />
        </div>
        <h2 style="color: #0a2e7a; text-align: center;">Registration Confirmation</h2>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for registering at AlMaghrib Academy! Here are your details:</p>
        
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Student ID:</strong> ${generatedStudentId}</p>
          <p><strong>Course:</strong> ${courseName || "Not specified"}</p>
          <p><strong>Hours per Week:</strong> ${hoursPerWeek || 0}h</p>
          <p><strong>Pricing Plan:</strong> ${pricingPlan || "Not specified"}</p>
          <p><strong>Preferred Days:</strong> ${preferredDays?.join(", ") || "Not specified"}</p>
          <p><strong>Trial Date:</strong> ${trialDate}</p>
          <p><strong>Preferred Time:</strong> ${preferredTime || "N/A"} ${ampm || ""}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
        </div>
        
        <p style="color: #0a2e7a; font-weight: 600;">📞 We'll contact you within 24 hours.</p>
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">Thank you for choosing AlMaghrib Academy!</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          AlMaghrib Academy &bull; <a href="https://www.AlMaghribacademy.co" style="color: #0a2e7a; text-decoration: none;">www.AlMaghribacademy.co</a>
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${email}`, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
    throw error; // Re-throw to handle in the main function
  }
}

async function sendAdminNotification(data: any) {
  const { 
    firstName, lastName, email, phone, alternativePhone, country, 
    gender, courseName, hoursPerWeek, pricingPlan, preferredDays, 
    trialDate, preferredTime, ampm, generatedStudentId 
  } = data;

  const adminEmail = process.env.ADMIN_EMAIL || "contact@AlMaghribacademy.co";
  console.log(`📧 Attempting to send admin notification to: ${adminEmail}`);

  const mailOptions = {
    from: `"AlMaghrib Academy" <${process.env.SMTP_FROM || "contact@AlMaghribacademy.co"}>`,
    to: adminEmail,
    subject: "🔔 New Student Registration - AlMaghrib Academy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0a2e7a;">🔔 New Student Registration</h2>
        <p>A new student has registered at AlMaghrib Academy:</p>
        
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="color: #0a2e7a; margin: 0 0 10px 0;">Student Details</h3>
          <p><strong>Student ID:</strong> ${generatedStudentId}</p>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${alternativePhone ? `<p><strong>Alternative Phone:</strong> ${alternativePhone}</p>` : ''}
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Gender:</strong> ${gender || "Not specified"}</p>
          
          <h3 style="color: #0a2e7a; margin: 16px 0 10px 0;">Course Preferences</h3>
          <p><strong>Course:</strong> ${courseName || "Not specified"}</p>
          <p><strong>Hours per Week:</strong> ${hoursPerWeek || 0}h</p>
          <p><strong>Pricing Plan:</strong> ${pricingPlan || "Not specified"}</p>
          <p><strong>Preferred Days:</strong> ${preferredDays?.join(", ") || "Not specified"}</p>
          <p><strong>Trial Date:</strong> ${trialDate}</p>
          <p><strong>Preferred Time:</strong> ${preferredTime || "N/A"} ${ampm || ""}</p>
        </div>
        
        <div style="background: #f0f4ff; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #0a2e7a;">
          <p style="margin: 0; color: #0a2e7a;">
            <strong>📞 Action Required:</strong> Please contact the student within 24 hours.
          </p>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
          View all registrations: <a href="https://www.AlMaghribacademy.co/admin/registrations" style="color: #0a2e7a;">Admin Dashboard</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          AlMaghrib Academy &bull; <a href="https://www.AlMaghribacademy.co" style="color: #0a2e7a; text-decoration: none;">www.AlMaghribacademy.co</a>
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent to ${adminEmail}`, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send admin notification:", error);
    throw error;
  }
}