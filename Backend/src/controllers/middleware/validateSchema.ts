import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { BadRequestError, ValidationError } from '../../errors/HttpError'

type Location = 'body' | 'query'

function parse(schema: AnyZodObject, payload: unknown) {
  return schema.parse(payload)
}

export function validateSchema(schema: AnyZodObject, location: Location = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    void res
    try {
      const parsed = parse(schema, location === 'body' ? req.body : req.query)

      if (location === 'body') {
        req.body = parsed
      } else {
        req.query = parsed as Request['query']
      }

      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        return next(new ValidationError(errors))
      }

      return next(new BadRequestError('Invalid request payload', ['Invalid request payload']))
    }
  }
}
