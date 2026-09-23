const { createProjectSchema, listProjectsQuerySchema } = require('../dtos/project.dto');
const { createFeedbackSchema } = require('../dtos/feedback.dto');
const projectRepository = require('../repositories/repository.project');
const feedbackRepository = require('../repositories/repository.feedback');
const profileRepository = require('../repositories/repository.profile');

async function store(req, res) {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const profile = await profileRepository.findById(parsed.data.profileId);
  if (!profile) {
    return res.status(404).json({ message: 'Perfil (profileId) não encontrado' });
  }

  try {
    const project = await projectRepository.create(parsed.data);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ message: 'Não foi possível criar o projeto. Verifique o profileId e os technologyIds.' });
  }
}

// GET /api/projects?technology=
async function index(req, res) {
  const parsed = listProjectsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const projects = await projectRepository.findAll(parsed.data);
  return res.json(projects);
}

async function show(req, res) {
  const project = await projectRepository.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Projeto não encontrado' });
  }
  return res.json(project);
}

// POST /api/projects/:id/feedbacks
// Regra de negócio: cadastra a nota (1-5) + comentário e recalcula a média do projeto.
async function storeFeedback(req, res) {
  const parsed = createFeedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const project = await projectRepository.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Projeto não encontrado' });
  }

  const feedback = await feedbackRepository.create({
    projectId: project.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  const aggregate = await feedbackRepository.aggregateByProject(project.id);
  const ratingCount = aggregate._count.rating;
  const averageRating = ratingCount > 0 ? Math.round(aggregate._avg.rating * 100) / 100 : 0;
  const updatedProject = await projectRepository.updateRatingStats(project.id, { averageRating, ratingCount });

  return res.status(201).json({ feedback, project: updatedProject });
}

// PUT /api/projects/:id/upvote
// Regra de negócio: incrementa a curtida/estrela do projeto.
async function upvote(req, res) {
  const project = await projectRepository.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Projeto não encontrado' });
  }

  const updatedProject = await projectRepository.incrementUpvote(project.id);
  return res.json(updatedProject);
}

module.exports = { store, index, show, storeFeedback, upvote };
