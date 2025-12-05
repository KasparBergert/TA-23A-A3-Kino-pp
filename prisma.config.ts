import 'dotenv/config'
import { defineConfig, env } from "prisma/config";
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: "Backend/prisma/migrations",
    seed: "bun run Backend/prisma/seed/seed.ts"
  },
  datasource:{
    url: env("DATABASE_URL")
  }
})
