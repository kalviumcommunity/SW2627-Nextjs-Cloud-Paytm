const prisma = require('@prisma/client');


const {PrismaClient} = prisma;

const prismaClient = new PrismaClient();

module.exports = prismaClient;