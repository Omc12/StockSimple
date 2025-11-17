const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Single Prisma client instance
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Optional raw query helper (use sparingly)
async function raw(query, params) {
  return prisma.$queryRawUnsafe(query, ...(params || []));
}

module.exports = { prisma, raw };