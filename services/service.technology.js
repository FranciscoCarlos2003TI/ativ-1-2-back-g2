const { createTechnologySchema } = require('../dtos/technology.dto');
const technologyRepository = require('../repositories/repository.technology');

async function store(req, res) {
  const parsed = createTechnologySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  try {
    const technology = await technologyRepository.create(parsed.data);
    return res.status(201).json(technology);
  } catch (error) {
    return res.status(400).json({ message: 'Não foi possível criar a tecnologia. O nome já pode existir.' });
  }
}

async function index(req, res) {
  const technologies = await technologyRepository.findAll();
  return res.json(technologies);
}

module.exports = { store, index };
