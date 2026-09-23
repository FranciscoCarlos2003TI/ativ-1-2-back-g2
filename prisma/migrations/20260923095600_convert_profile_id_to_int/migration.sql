-- Converte profiles.id de TEXT (uuid) para INTEGER (autoincrement), preservando os dados.
-- O Prisma não gera essa conversão sozinho porque não existe CAST de texto para inteiro.

-- 1) Remove a FK que aponta para profiles.id
ALTER TABLE "projects" DROP CONSTRAINT "projects_profileId_fkey";

-- 2) Cria a nova coluna inteira com ids automáticos (1, 2, 3...) para cada perfil existente
ALTER TABLE "profiles" ADD COLUMN "new_id" SERIAL;

-- 3) Reaponta cada projeto para o novo id inteiro do seu perfil
UPDATE "projects" p
SET "profileId" = pp."new_id"
FROM "profiles" pp
WHERE pp."id" = p."profileId";

-- 3.1) Converte o tipo da coluna profileId de TEXT para INTEGER
ALTER TABLE "projects" ALTER COLUMN "profileId" TYPE INTEGER USING "profileId"::integer;

-- 4) Substitui a coluna antiga (texto) pela nova (inteira) e recria a PK
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey";
ALTER TABLE "profiles" DROP COLUMN "id";
ALTER TABLE "profiles" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "profiles" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- 5) Recria a FK
ALTER TABLE "projects" ADD CONSTRAINT "projects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;