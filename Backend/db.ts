import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: 'localhost', // your database host
  user: 'root', // your database username
  password: process.env.DBrootpass!, // your database password
  database: 'movies', // optional, your database name
})

const prisma = new PrismaClient({adapter})
export default prisma
