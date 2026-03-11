import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

declare global {
  var prisma: PrismaClient;
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'info', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV === 'development') {
  console.log('dev init prisma...');
  global.prisma = prisma;
}

export default prisma;
