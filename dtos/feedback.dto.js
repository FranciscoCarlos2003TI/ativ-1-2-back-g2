const { z } = require('zod');

const createFeedbackSchema = z.object({
  rating: z
    .number('A nota é obrigatória')
    .int('A nota deve ser um número inteiro')
    .min(1, 'A nota mínima é 1')
    .max(5, 'A nota máxima é 5'),
  comment: z
    .string('O comentário é obrigatório')
    .trim()
    .min(1, 'O comentário é obrigatório')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres'),
});

module.exports = { createFeedbackSchema };
