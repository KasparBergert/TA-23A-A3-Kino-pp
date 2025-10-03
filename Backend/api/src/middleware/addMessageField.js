import codeToMessage from '../../../api/utils/codeToMessage.js'

export default function addMessageField(req, res, next) {
  const oldSend = res.send

  res.send = function (body) {
    if (typeof body == 'object' && !('code' in body)) {
      throw Error("Response body doesn't include a 'code' field or is not an 'object'")
    }

    if (typeof body == 'object' && 'code' in body && !('message' in body)) {
      const code = body.code
      const message = codeToMessage(code)
      body = { ...body, message }
    }
    return oldSend.call(this, body)
  }
  next()
}
