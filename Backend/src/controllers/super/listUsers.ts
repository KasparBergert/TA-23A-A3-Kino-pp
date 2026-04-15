import { Request, Response } from 'express'
import prisma from '../../../db'

export default async function listUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany()
  res.json(users)
}
