import { Request, Response } from 'express'

export default function login(req: Request, res: Response) {
  //models must be used for type checking
  //userSchema
  res.send('Login works')
}
