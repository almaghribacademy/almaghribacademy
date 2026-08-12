-- DropIndex
DROP INDEX "teacher_registrations_email_key";

-- AlterTable
ALTER TABLE "student_registrations" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "teacher_registrations" ALTER COLUMN "email" SET DATA TYPE TEXT;
