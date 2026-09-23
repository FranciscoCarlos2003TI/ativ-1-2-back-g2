
const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'DevShowcase API',
    version: '2.0.0',
    description:
      'API para publicação de projetos de desenvolvedores, com feedbacks (nota + comentário), ' +
      'curtidas (upvotes) e busca de projetos com filtro por tecnologia.',
  },
  servers: [{ url: '/api', description: 'Prefixo padrão da API' }],
  tags: [
    { name: 'Profiles', description: 'Perfis de desenvolvedores' },
    { name: 'Technologies', description: 'Tecnologias usadas nos projetos' },
    { name: 'Projects', description: 'Projetos, feedbacks e upvotes' },
  ],
  paths: {
    '/profiles': {
      post: {
        tags: ['Profiles'],
        summary: 'Cria um novo perfil de desenvolvedor',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProfile' } } },
        },
        responses: {
          201: { description: 'Perfil criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'E-mail já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/profiles/{id}': {
      get: {
        tags: ['Profiles'],
        summary: 'Busca um perfil pelo ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Perfil encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } },
          404: { description: 'Perfil não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/tech': {
      post: {
        tags: ['Technologies'],
        summary: 'Cria uma nova tecnologia',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTechnology' } } },
        },
        responses: {
          201: { description: 'Tecnologia criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Technology' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'Tecnologia já existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      get: {
        tags: ['Technologies'],
        summary: 'Lista todas as tecnologias',
        responses: {
          200: {
            description: 'Lista de tecnologias',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Technology' } } } },
          },
        },
      },
    },
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Lista projetos com filtro por tecnologia',
        parameters: [
          { name: 'technology', in: 'query', description: 'Nome da tecnologia para filtrar (case-insensitive)', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Lista de projetos',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } },
          },
          400: { description: 'Parâmetros de busca inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Projects'],
        summary: 'Cadastra um novo projeto',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProject' } } },
        },
        responses: {
          201: { description: 'Projeto criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'profileId não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Busca um projeto pelo ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Projeto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
          404: { description: 'Projeto não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/projects/{id}/feedbacks': {
      post: {
        tags: ['Projects'],
        summary: 'Cadastra uma nota (1 a 5) e comentário para o projeto',
        description: 'Ao ser criado, o feedback recalcula automaticamente a nota média (averageRating) do projeto.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateFeedback' } } },
        },
        responses: {
          201: {
            description: 'Feedback registrado e nota média do projeto atualizada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    feedback: { $ref: '#/components/schemas/Feedback' },
                    project: { $ref: '#/components/schemas/Project' },
                  },
                },
              },
            },
          },
          400: { description: 'Nota/comentário inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Projeto não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/projects/{id}/upvote': {
      put: {
        tags: ['Projects'],
        summary: 'Incrementa a curtida (upvote) do projeto',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Upvote registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
          404: { description: 'Projeto não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'NotFoundError' },
          message: { type: 'string', example: 'Projeto não encontrado' },
          details: { type: 'object', nullable: true },
        },
      },
      CreateProfile: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Ada Lovelace' },
          email: { type: 'string', format: 'email', example: 'ada@exemplo.com' },
          bio: { type: 'string', nullable: true },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string' },
          email: { type: 'string' },
          bio: { type: 'string', nullable: true },
          avatarUrl: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTechnology: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', example: 'Node.js' } },
      },
      Technology: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProject: {
        type: 'object',
        required: ['title', 'description', 'repositoryUrl', 'profileId'],
        properties: {
          title: { type: 'string', example: 'DevShowcase API' },
          description: { type: 'string', example: 'API REST para portfólio de projetos.' },
          repositoryUrl: { type: 'string', format: 'uri', example: 'https://github.com/usuario/projeto' },
          demoUrl: { type: 'string', format: 'uri', nullable: true },
          profileId: { type: 'integer', example: 1 },
          technologyIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          repositoryUrl: { type: 'string' },
          demoUrl: { type: 'string', nullable: true },
          averageRating: { type: 'number', format: 'float', example: 4.5 },
          ratingCount: { type: 'integer', example: 2 },
          upvotes: { type: 'integer', example: 10 },
          createdAt: { type: 'string', format: 'date-time' },
          profileId: { type: 'integer' },
          profile: { $ref: '#/components/schemas/Profile' },
          technologies: { type: 'array', items: { $ref: '#/components/schemas/Technology' } },
        },
      },
      CreateFeedback: {
        type: 'object',
        required: ['rating', 'comment'],
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', example: 'Projeto muito bem estruturado!' },
        },
      },
      Feedback: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          rating: { type: 'integer' },
          comment: { type: 'string' },
          projectId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

module.exports = openapiSpec;
