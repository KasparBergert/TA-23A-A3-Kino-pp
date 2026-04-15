import { Request, Response } from 'express'
import { userRole } from '@prisma/client'
import passwordUtils from '../../../utils/passwordUtils'
import { userCreateSchema, UserCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import prisma from '../../../db'

async function createUserHandler(req: Request, res: Response) {
  const { email, password, role } = req.body as UserCreateInput

  // role validation (email/password already validated by middleware)
  if (!Object.values(userRole).includes(role)) {
    return res.status(400).send('Invalid role')
  }

  const existing = await prisma.user.findFirst({
    where: { email },
  })
  if (existing) {
    return res.status(409).send('User already exists')
  }

  try {
    const hashedPassword = await passwordUtils.createhash(password)
    const created = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    })
    if (!created) return res.status(500).send('Failed to create user')

    return res.status(201).json({ id: created.id, email: created.email, role: created.role })
  } catch (err) {
    console.error('Failed to create user', err)
    return res.status(500).send('Failed to create user')
  }
}

const createUser = [validateSchema(userCreateSchema), createUserHandler]

export default createUser
