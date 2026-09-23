const { z } = require('zod');

const createProjectSchema = z.object({
title: z.string('O título é obrigatório').min(1, 'O título é obrigatório'),
description: z.string('A descrição é obrigatória').min(1, 'A descrição é obrigatória'),
repositoryUrl: z.string('A URL do repositório é obrigatória').url('URL do repositório inválida'),
demoUrl: z.string().url('URL de demonstração inválida').optional(),
profileId: z.coerce.number('O profileId é obrigatório').int('O profileId deve ser um número inteiro').positive('O profileId é inválido'),
technologyIds: z.array(z.string().uuid('technologyIds deve conter apenas UUIDs válidos')).optional(),
});

// GET /api/projects?technology=react
const listProjectsQuerySchema = z.object({
technology: z.string().trim().min(1).optional(),
});

module.exports = { createProjectSchema, listProjectsQuerySchema };