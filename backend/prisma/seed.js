import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@123';

const daysFromNow = (days, hour = 18, minute = 30) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const img = (seed) => `https://picsum.photos/seed/${seed}/800/450`;

const events = [
  { title: 'Sunset Indie Night', category: 'MUSIC', city: 'Coimbatore', startsAt: daysFromNow(3, 19), price: 499, description: 'Live indie bands on an open-air stage.', imageUrl: img('indie') },
  { title: 'Classical Evenings', category: 'MUSIC', city: 'Chennai', startsAt: daysFromNow(9, 18), price: 750, description: 'Carnatic vocal and violin recital.', imageUrl: img('classical') },
  { title: 'Pottery for Beginners', category: 'WORKSHOP', city: 'Bengaluru', startsAt: daysFromNow(5, 10), price: 1200, description: 'Hands-on wheel throwing, all materials included.', imageUrl: img('pottery') },
  { title: 'Photography Walk', category: 'WORKSHOP', city: 'Coimbatore', startsAt: daysFromNow(12, 6, 30), price: 350, description: 'Early morning street photography with a mentor.', imageUrl: img('photowalk') },
  { title: 'Street Food Carnival', category: 'FOOD', city: 'Chennai', startsAt: daysFromNow(7, 17), price: 150, description: 'Over 40 stalls from across South India.', imageUrl: img('streetfood') },
  { title: 'Biryani Festival', category: 'FOOD', city: 'Hyderabad', startsAt: daysFromNow(15, 12), price: 299, description: 'Regional biryanis, one plate at a time.', imageUrl: img('biryani') },
  { title: 'City 10K Run', category: 'SPORTS', city: 'Bengaluru', startsAt: daysFromNow(20, 5, 30), price: 600, description: 'Timed 10K run through the city centre.', imageUrl: img('run10k') },
  { title: 'Weekend Cricket League', category: 'SPORTS', city: 'Coimbatore', startsAt: daysFromNow(4, 8), price: 1500, description: 'Team entry for the 20-over community league.', imageUrl: img('cricket') },
  { title: 'Story Time & Puppets', category: 'KIDS', city: 'Chennai', startsAt: daysFromNow(6, 16), price: 0, description: 'Free puppet show and storytelling for ages 4-8.', imageUrl: img('puppets') },
  { title: 'Junior Science Lab', category: 'KIDS', city: 'Hyderabad', startsAt: daysFromNow(10, 11), price: 450, description: 'Safe, fun experiments for curious kids.', imageUrl: img('sciencelab') },
  { title: 'Grand Music Gala', category: 'MUSIC', city: 'Bengaluru', startsAt: daysFromNow(30, 20), price: 150000, description: 'Premium gala night with a full orchestra.', imageUrl: img('gala') },

  { title: 'Rooftop Jazz Session', category: 'MUSIC', city: 'Chennai', startsAt: daysFromNow(8, 20), price: 800, description: 'Cancelled due to venue issues.', imageUrl: img('jazz'), isActive: false },
  { title: 'Chocolate Making Class', category: 'FOOD', city: 'Bengaluru', startsAt: daysFromNow(14, 15), price: 900, description: 'Paused until the instructor is confirmed.', imageUrl: img('chocolate'), isActive: false },

  { title: 'Monsoon Music Fest', category: 'MUSIC', city: 'Coimbatore', startsAt: daysFromNow(-10, 19), price: 550, description: 'Last month\'s monsoon festival.', imageUrl: img('monsoon') },
  { title: 'Kids Football Camp', category: 'KIDS', city: 'Hyderabad', startsAt: daysFromNow(-20, 9), price: 700, description: 'A weekend football camp that already happened.', imageUrl: img('kidsfootball') },
];

async function main() {
  await prisma.event.deleteMany();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: 'ADMIN' },
    create: { name: 'Demo Admin', email: ADMIN_EMAIL, passwordHash, role: 'ADMIN' },
  });

  await prisma.event.createMany({ data: events });

  console.log(`Seeded ${events.length} events and admin user ${ADMIN_EMAIL}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
