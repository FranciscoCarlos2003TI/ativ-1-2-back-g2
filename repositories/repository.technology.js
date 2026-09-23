const prisma = require('../config/prisma');

async function create(data) {
return prisma.technology.create({ data });
}

async function findAll() {
return prisma.technology.findMany();
}
module.exports = { create, findAll };