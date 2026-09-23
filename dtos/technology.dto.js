const { z } = require('zod');

const createTechnologySchema = z.object({
name: z.string().min(1, 'O nome da tecnologia é obrigatório'),
});
module.exports = { createTechnologySchema };