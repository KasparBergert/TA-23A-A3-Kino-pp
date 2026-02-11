import { Request, Response } from 'express'
import userRepository from '../../repositories/UserRepository'

export default async function listUsers(req: Request, res: Response) {
  const users = await userRepository.getAll()
  res.json(users)
}
