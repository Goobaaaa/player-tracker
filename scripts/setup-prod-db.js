const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.production' });

console.log('🚀 Setting up production database...');

try {
  // Generate Prisma client
  console.log('📝 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema to production
  console.log('🔄 Pushing database schema to production...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  // Seed the database
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('✅ Production database setup complete!');
} catch (error) {
  console.error('❌ Error setting up production database:', error.message);
  process.exit(1);
}