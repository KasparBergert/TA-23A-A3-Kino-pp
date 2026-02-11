import { Request, Response } from 'express'
import { userRole } from '@prisma/client'
import userRepository from '../../repositories/UserRepository'
import passwordUtils from '../../../utils/passwordUtils'

export default async function createUser(req: Request, res: Response) {
  const { email, password, role } = req.body

  // role validation (email/password already validated by middleware)
  if (!Object.values(userRole).includes(role)) {
    return res.status(400).send('Invalid role')
  }

  const existing = await userRepository.getByEmail(email)
  if (existing) {
    return res.status(409).send('User already exists')
  }

  try {
    const hashedPassword = await passwordUtils.createhash(password)
    const created = await userRepository.create({ email, password: hashedPassword, role })
    if (!created) return res.status(500).send('Failed to create user')

    return res.status(201).json({ id: created.id, email: created.email, role: created.role })
  } catch (err) {
    console.error('Failed to create user', err)
    return res.status(500).send('Failed to create user')
  }
}
