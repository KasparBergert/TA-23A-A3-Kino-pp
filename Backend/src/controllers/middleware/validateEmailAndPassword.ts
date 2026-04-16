import { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../../errors/HttpError.ts'
import passwordUtils from '../../../utils/passwordUtils.ts'
import emailUtils from '../../../utils/EmailUtils.ts'

export default function validateEmailAndPassword(req: Request, res: Response, next: NextFunction) {
  void res
  const body = req.body
  if (!body || typeof body !== 'object') {
    return next(new BadRequestError("Body not sent '{email, password}'"))
  }

  const { email, password } = body

  if (typeof email !== 'string' || typeof password !== 'string') {
    return next(new BadRequestError('email or password are required to be strings'))
  }

  if (!emailUtils.validate(email)) {
    return next(new BadRequestError('Email is not valid'))
  }

  if (!passwordUtils.validate(password)) {
    return next(new BadRequestError('Password more than 99 characters'))
  }

  return next()
}
