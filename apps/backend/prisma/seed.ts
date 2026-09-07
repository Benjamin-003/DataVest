import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding...');

  await prisma.currency.createMany({
    data: [
      { code: 'USD', label: 'US Dollar',        flag: '🇺🇸' },
      { code: 'EUR', label: 'Euro',              flag: '🇪🇺' },
      { code: 'GBP', label: 'British Pound',     flag: '🇬🇧' },
      { code: 'JPY', label: 'Japanese Yen',      flag: '🇯🇵' },
      { code: 'CHF', label: 'Swiss Franc',       flag: '🇨🇭' },
      { code: 'CAD', label: 'Canadian Dollar',   flag: '🇨🇦' },
      { code: 'AUD', label: 'Australian Dollar', flag: '🇦🇺' },
    ],
    skipDuplicates: true,
  });

  await prisma.language.createMany({
    data: [
      { code: 'FR', label: 'Français' },
      { code: 'EN', label: 'English'  },
      { code: 'DE', label: 'Deutsch'  },
      { code: 'ES', label: 'Español'  },
      { code: 'IT', label: 'Italiano' },
    ],
    skipDuplicates: true,
  });

  await prisma.subscription.createMany({
    data: [
      { code: 'FREE',    label: 'Gratuit', isDefault: true  },
      { code: 'BASIC',   label: 'Basic',   isDefault: false },
      { code: 'PREMIUM', label: 'Premium', isDefault: false },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed terminé.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });