-- CreateTable
CREATE TABLE "student_trials" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "detectedCountry" TEXT,
    "country" VARCHAR(50) NOT NULL,
    "preferred_course" VARCHAR(50) NOT NULL,
    "session_for" VARCHAR(20) NOT NULL,
    "preferred_teacher" VARCHAR(20) NOT NULL,
    "source" VARCHAR(50),
    "preferred_date" DATE,
    "preferred_time" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "captcha_token" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_trials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_applications" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "country_code" VARCHAR(10),
    "mobile" VARCHAR(20) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "marital_status" VARCHAR(20) NOT NULL,
    "nationality" VARCHAR(50) NOT NULL,
    "occupation" VARCHAR(100) NOT NULL,
    "about_me" TEXT NOT NULL,
    "facebook_profile" VARCHAR(255) NOT NULL,
    "profile_image" VARCHAR(500),
    "education" VARCHAR(50) NOT NULL,
    "experience" VARCHAR(50) NOT NULL,
    "mother_language" VARCHAR(50) NOT NULL,
    "other_language" VARCHAR(50) NOT NULL,
    "cv_file_path" VARCHAR(500),
    "audio_file_path" VARCHAR(500),
    "profile_image_public_id" VARCHAR(200),
    "cv_public_id" VARCHAR(200),
    "audio_public_id" VARCHAR(200),
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "admin_notes" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_registrations" (
    "id" SERIAL NOT NULL,
    "student_id" VARCHAR(20),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "date_of_birth" DATE,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "alternative_phone" VARCHAR(20),
    "country" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50),
    "address" TEXT,
    "gender" VARCHAR(20),
    "parent_name" VARCHAR(100),
    "parent_phone" VARCHAR(20),
    "parent_email" VARCHAR(100),
    "course_id" INTEGER,
    "enrollment_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trial_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_registrations" (
    "id" SERIAL NOT NULL,
    "teacher_id" VARCHAR(20),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(20),
    "date_of_birth" DATE,
    "education" VARCHAR(50),
    "qualification_details" TEXT,
    "experience_years" INTEGER,
    "mother_language" VARCHAR(50),
    "languages" VARCHAR(200),
    "specializations" TEXT,
    "teaching_certificates" TEXT,
    "profile_image" VARCHAR(255),
    "cv_file" VARCHAR(255),
    "audio_sample" VARCHAR(255),
    "hire_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_registrations" (
    "id" SERIAL NOT NULL,
    "staff_id" VARCHAR(20),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(20),
    "date_of_birth" DATE,
    "position" VARCHAR(50),
    "department" VARCHAR(50),
    "education" VARCHAR(50),
    "experience_years" INTEGER,
    "joining_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "course_code" VARCHAR(20),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50),
    "level" VARCHAR(50),
    "duration_weeks" INTEGER,
    "price" DECIMAL(10,2),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "enrollment_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "fee_paid" BOOLEAN NOT NULL DEFAULT false,
    "amount_paid" DECIMAL(10,2),
    "payment_method" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(30) NOT NULL DEFAULT 'editor',
    "last_login" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_applications_email_key" ON "teacher_applications"("email");

-- CreateIndex
CREATE INDEX "ContactMessage_email_idx" ON "ContactMessage"("email");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_submittedAt_idx" ON "ContactMessage"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "student_registrations_student_id_key" ON "student_registrations"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_registrations_email_key" ON "student_registrations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_registrations_teacher_id_key" ON "teacher_registrations"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_registrations_email_key" ON "teacher_registrations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_registrations_staff_id_key" ON "staff_registrations"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_registrations_email_key" ON "staff_registrations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");
