import codeToMessage from '../../utils/codeToMessage.ts'
import { Response, Request, NextFunction } from 'express'

export default function addMessageField(req: Request, res: Response, next: NextFunction) {
  const oldSend = res.send

  res.send = function (body) {
    if (typeof body == 'object' && !('code' in body)) {
      // throwing an error because sending a response without a code is against API standards.      
      throw Error("HEY developer. you have to add a 'code' field for a message field to appear")      
    }

    if (typeof body == 'object' && 'code' in body && !('message' in body)) {
      const code = body.code
      const message = codeToMessage(code)
      if (!message) {
        // message is undefined
        // throwing an error because every code should have its own message.        
        throw Error("HEY developer. you have to add a message that matches the code.")
      }
      body = { ...body, message }
    }
    return oldSend.call(this, body)
  }
  next()
}
