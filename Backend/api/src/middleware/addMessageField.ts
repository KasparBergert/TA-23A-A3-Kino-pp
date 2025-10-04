import codeToMessage from '../../utils/codeToMessage.ts'
import { Response, Request, NextFunction } from 'express'

export default function addMessageField(req: Request, res: Response, next: NextFunction) {
  const oldSend = res.send

  res.send = function (body) {
    if (typeof body == 'object' && !('code' in body)) {
      // throwing an error because sending a response without a code is against API standards.
      throw Error("Response body doesn't include a 'code' field or is not an 'object'")
    }

    if (typeof body == 'object' && 'code' in body && !('message' in body)) {
      const code = body.code
      const message = codeToMessage(code)
      if (!message) {
        // message is undefined
        // throwing an error because every code should have its own message.
        throw Error("code doesn't have a corresponding messsage")
      }
      body = { ...body, message }
    }
    return oldSend.call(this, body)
  }
  next()
}
