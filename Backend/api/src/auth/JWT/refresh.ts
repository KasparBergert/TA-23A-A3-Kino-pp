import { Request, Response } from 'express'

export default function refresh(req: Request, res: Response) {
  /*
  
  API endpoint checks if refresh token is valid
  no? send AUTH-0005


  creates and sends new refresh token and access token 
  send AUTH-0008

  */
  return res.send('1234')
}
