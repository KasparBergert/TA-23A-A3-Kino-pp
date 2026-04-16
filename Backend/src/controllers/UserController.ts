import type { NextFunction, Request, Response } from 'express'
import { userRole } from '@prisma/client'
import { BadRequestError } from '../errors/HttpError'
import { userCreateSchema, userRoleUpdateSchema, UserCreateInput } from '../dto/schemas'
import userService from '../services/UserService'
import { validateSchema } from './middleware/validateSchema'

class UserController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    void req
    try {
      return res.json(await userService.listUsers())
    } catch (error) {
      return next(error)
    }
  }

  create = [validateSchema(userCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body as UserCreateInput

    if (!Object.values(userRole).includes(role)) {
      return next(new BadRequestError('Invalid role'))
    }

    try {
      const created = await userService.createUser(email, password, role)
      return res.status(201).json({ id: created.id, email: created.email, role: created.role })
    } catch (error) {
      return next(error)
    }
  }]

  updateRole = [validateSchema(userRoleUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.userId)
    const { role } = req.body as { role: userRole }
    if (Number.isNaN(id)) return next(new BadRequestError('Invalid id'))
    if (!Object.values(userRole).includes(role)) return next(new BadRequestError('Invalid role'))

    try {
      return res.json(await userService.updateUserRole(id, role))
    } catch (error) {
      return next(error)
    }
  }]

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.userId)
    if (Number.isNaN(id)) return next(new BadRequestError('Invalid id'))

    try {
      await userService.deleteUser(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export default UserController
