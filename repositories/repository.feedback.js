const prisma = require('../config/prisma');

async function create({ projectId, rating, comment }) {
  return prisma.feedback.create({
    data: { projectId, rating, comment },
  });
}

async function aggregateByProject(projectId) {
  return prisma.feedback.aggregate({
    where: { projectId },
    _avg: { rating: true },
    _count: { rating: true },
  });
}

module.exports = { create, aggregateByProject };
