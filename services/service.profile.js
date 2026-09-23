const { createProfileSchema } = require('../dtos/profile.dto');
const profileRepository = require('../repositories/repository.profile');

async function store(req, res) {
  const parsed = createProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  try {
    const profile = await profileRepository.create(parsed.data);
    return res.status(201).json(profile);
  } catch (error) {
    return res.status(400).json({ message: 'Não foi possível criar o perfil. O e-mail já pode estar em uso.' });
  }
}

async function show(req, res) {
  const { id } = req.params;
  const profile = await profileRepository.findById(Number(id));
  if (!profile) {
    return res.status(404).json({ message: 'Perfil não encontrado' });
  }
  return res.json(profile);
}

module.exports = { store, show };
