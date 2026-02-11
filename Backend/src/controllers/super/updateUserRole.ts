import { Request, Response } from 'express'
import userRepository from '../../repositories/UserRepository'
import { userRole } from '@prisma/client'
import { userRoleUpdateSchema } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'

async function updateUserRoleHandler(req: Request, res: Response) {
  const id = Number(req.params.userId)
  const { role } = req.body as { role: userRole }
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')
  if (!Object.values(userRole).includes(role)) return res.status(400).send('Invalid role')

  try {
    const user = await userRepository.updateRole(id, role)
    res.json(user)
  } catch {
    res.status(404).send('User not found')
  }
}

const updateUserRole = [validateSchema(userRoleUpdateSchema), updateUserRoleHandler]

export default updateUserRole
