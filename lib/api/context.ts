import { PrismaClient } from '../../generated/prisma/client';

export interface Context {
  prisma: PrismaClient;
  currentUser?: { id: number };
}
