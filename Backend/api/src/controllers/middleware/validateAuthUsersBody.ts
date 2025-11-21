import { NextFunction, Request, Response } from 'express'
import Prisma from '@prisma/client'

function validateEmail(email: string) {
  //regex to check if google mail
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  return emailRegex.test(email)
}

function validatePassword(password: string) {
  //must be less than 99 chars
  return password.length < 100
}

export default function validateAuthUsersBody(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl.search(/auth\/users/g) >= 0) {


    const body = req.body
    if (typeof body !== 'object' || body == 'null') {
      return res.status(400).send()
    }

    //type check the values
    const { email, password } = body
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid) {
      return res.status(400).send('Email is not valid')
    }

    if (!isPasswordValid) {
      return res.status(400).send('Password more than 99 characters')
    }
  }
  next()
}
