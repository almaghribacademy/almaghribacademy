const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // CREATE SUPER ADMIN
  // ============================================
  console.log('👑 Creating super admin user...');

  const adminEmail = 'admin@AlMaghribacademy.co';
  const adminPassword = 'Admin123$'; // CHANGE THIS IN PRODUCTION!
  
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.adminUser.create({
      data: {
        username: 'superadmin',
        email: adminEmail,
        passwordHash: hashedPassword,
        fullName: 'System Super Admin',
        role: 'super_admin',
        status: 'active'
      }
    });
    
    console.log('✅ Super admin created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️  IMPORTANT: Change this password after first login!');
  } else {
    console.log('ℹ️  Super admin already exists, skipping...');
  }

  // ============================================
  // SEED COURSES
  // ============================================
  console.log('📚 Seeding courses...');

  const courses = [
    { id: 1, name: 'Quran', description: 'Learn Quran with Tajweed and proper recitation', status: 'active' },
    { id: 2, name: 'Arabic', description: 'Learn Arabic Language from beginner to advanced', status: 'active' },
    { id: 3, name: 'Islamic Studies', description: 'Learn Islamic Studies including Aqeedah, Fiqh, and Seerah', status: 'active' },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        name: course.name,
        description: course.description,
        status: course.status,
      },
      create: {
        id: course.id,
        name: course.name,
        description: course.description,
        status: course.status,
      },
    });
  }

  console.log('✅ Courses seeded successfully!');

  // ============================================
  // SEED PRICING PLANS (Optional)
  // ============================================
  console.log('💰 Seeding pricing plans...');

  const pricingPlans = [
    { id: 1, name: 'Basic', hourlyRate: 8, multiplier: 1, description: 'Standard pricing plan' },
    { id: 2, name: 'Essentials', hourlyRate: 9, multiplier: 1.125, description: 'Essential plan with extra features' },
    { id: 3, name: 'Premium', hourlyRate: 11, multiplier: 1.375, description: 'Premium plan with all features' },
    { id: 4, name: 'Platinum', hourlyRate: 14, multiplier: 1.75, description: 'Platinum plan with premium support' },
  ];

  try {
    for (const plan of pricingPlans) {
      await prisma.pricingPlan.upsert({
        where: { id: plan.id },
        update: {
          name: plan.name,
          hourlyRate: plan.hourlyRate,
          multiplier: plan.multiplier,
          description: plan.description,
        },
        create: {
          id: plan.id,
          name: plan.name,
          hourlyRate: plan.hourlyRate,
          multiplier: plan.multiplier,
          description: plan.description,
        },
      });
    }
    console.log('✅ Pricing plans seeded successfully!');
  } catch (error) {
    console.log('⚠️ PricingPlan model not found, skipping...');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });