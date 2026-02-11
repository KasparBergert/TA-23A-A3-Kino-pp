import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

type Location = 'body' | 'query'

function parse(schema: AnyZodObject, payload: unknown) {
  return schema.parse(payload)
}

export function validateSchema(schema: AnyZodObject, location: Location = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = parse(schema, location === 'body' ? req.body : req.query)
      if (location === 'body') {
        req.body = parsed
      } else {
        req.query = parsed
      }
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        return res.status(400).json({ errors })
      }
      return res.status(400).json({ errors: ['Invalid request payload'] })
    }
  }
}
