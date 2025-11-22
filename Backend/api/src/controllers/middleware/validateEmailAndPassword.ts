import { NextFunction, Request, Response } from 'express'
import passwordUtils from '../../../utils/passwordUtils'
import emailUtils from '../../../utils/EmailUtils'

export default function validateEmailAndPassword(req: Request, res: Response, next: NextFunction) {
  const body = req.body
  if (typeof body !== 'object' || body == 'null') {
    return res.status(400).send("Body not sent '{email, password}'")
  }

  //type check the values
  const { email, password } = body
  const isEmailValid = emailUtils.validate(email)
  const isPasswordValid = passwordUtils.validate(password)

  if (!isEmailValid) {
    return res.status(400).send('Email is not valid')
  }

  if (!isPasswordValid) {
    return res.status(400).send('Password more than 99 characters')
  }
  next()
}
