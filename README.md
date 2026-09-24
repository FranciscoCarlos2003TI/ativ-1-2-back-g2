# DevShowcase API 

API REST para publicação de projetos de desenvolvedores, com feedbacks (nota 1-5 + comentário), curtidas (upvotes) e busca de projetos com filtro por tecnologia.

## Arquitetura

```
rotas/         -> define as rotas e liga cada uma a uma função do service
services/      -> recebe (req, res): valida a entrada (Zod), aplica as regras
                   de negócio (cálculo de média, upvote) e responde
repositories/  -> acesso a dados via Prisma
dtos/          -> schemas Zod de validação de entrada
middlewares/   -> manipulador global de erros (rota inexistente / erro inesperado)
docs/          -> especificação OpenAPI (Swagger)
```

Cada função do serviço valida o corpo/query com Zod e responde diretamente com `res.status(400).json(...)` quando inválido, e com `res.status(404).json(...)` quando o recurso não existe — sem abstrações extras, para ficar fácil de acompanhar o fluxo. O `middlewares/errorHandler.js` apenas cobre dois casos que não têm uma rota específica para tratar: uma rota que não existe (404) e um erro inesperado não capturado (500), incluindo JSON inválido no corpo da requisição.

## Rodando localmente

```
npm install
npx prisma migrate deploy   # aplica as migrações no banco definido em DATABASE_URL
npm start                   # inicia em http://localhost:3000
```

Documentação interativa (Swagger UI): `http://localhost:3000/api/docs`
Especificação OpenAPI (JSON): `http://localhost:3000/api/docs.json`

## Variáveis de ambiente (`.env`)

| Variável    | Descrição                              |
|-------------|----------------------------------------|
| `DATABASE_URL` | String de conexão do PostgreSQL (ex.: Neon) |
| `PORT`      | Porta do servidor (opcional, padrão 3000) |

## Endpoints principais

| Método  | Rota                          | Descrição                                    |
|---------|-------------------------------|----------------------------------------------|
| GET     | `/api/projects`               | Lista projetos, com `?technology=`           |
| POST    | `/api/projects`               | Cria um projeto                              |
| GET     | `/api/projects/:id`           | Busca um projeto pelo ID                     |
| POST    | `/api/projects/:id/feedbacks` | Registra nota (1-5) + comentário e recalcula a média |
| PUT     | `/api/projects/:id/upvote`    | Incrementa a curtida do projeto              |
| POST    | `/api/profiles`               | Cria um perfil de desenvolvedor              |
| GET     | `/api/profiles/:id`           | Busca um perfil pelo ID                      |
| POST    | `/api/tech`                   | Cria uma tecnologia                          |
| GET     | `/api/tech`                   | Lista as tecnologias                         |

## Deploy gratuito (Render)

O banco de dados já roda no plano gratuito do [Neon](https://neon.tech). Para publicar a API, o [Render](https://render.com) tem um plano free para serviços web Node:

1. Suba este projeto para um repositório no GitHub (garanta que `.env` **não** seja versionado — já está no `.gitignore`).
2. Em [render.com](https://render.com), clique em **New > Blueprint** e aponte para o repositório (ele detecta o `render.yaml` na raiz), ou crie manualmente um **Web Service**:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Configure a variável de ambiente `DATABASE_URL` no painel do Render com uma connection string do Neon.
4. Faça o deploy. O Render expõe a porta via `process.env.PORT`, já usada em `server.js`.
5. Após o deploy, a documentação fica em `https://<seu-servico>.onrender.com/api/docs`.

> Observação: no plano free do Render o serviço "dorme" após períodos de inatividade e leva alguns segundos para acordar na primeira requisição seguinte — normal para esse nível.
