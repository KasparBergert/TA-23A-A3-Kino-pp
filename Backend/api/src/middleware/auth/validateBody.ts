import { NextFunction, Request, Response } from 'express'
import userSchema from '../../../../models/userSchema.ts'

export default function validateAuthUsersBody(req: Request, res: Response, next: NextFunction) {  
  if (req.originalUrl.search(/auth\/users/g) >= 0) {
    const body = req.body
    if (typeof body != 'object') {
      return res.status(400).send({
        code: 'VAL-0001',
      })
    }

    //type check the values
    const { error } = userSchema.validate(body)
    if (error) {
      return res.status(400).send({
        code: 'AUTH-0006',
        message: error.details[0]?.message,
      }) // user sent body which is not valid
    }
  }  
  next()
}
