const prisma = require('../config/prisma')

async function create(data) {
return prisma.profile.create({ data });
}

async function findById(id) {
return prisma.profile.findUnique({
where: { id },
include: { projects: true },
});
}
module.exports = { create, findById };