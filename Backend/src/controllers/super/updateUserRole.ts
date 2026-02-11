import { Request, Response } from 'express'
import userRepository from '../../repositories/UserRepository'
import { userRole } from '@prisma/client'

export default async function updateUserRole(req: Request, res: Response) {
  const id = Number(req.params.userId)
  const { role } = req.body
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')
  if (!Object.values(userRole).includes(role)) return res.status(400).send('Invalid role')

  try {
    const user = await userRepository.updateRole(id, role)
    res.json(user)
  } catch {
    res.status(404).send('User not found')
  }
}
