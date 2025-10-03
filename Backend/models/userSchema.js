import Joi from 'joi'

const userSchema = Joi.object({
  id: Joi.number().messages({
    'number.base': 'Id is not a number or could not be cast to a number',
  }),
  name: Joi.string()
    .pattern(/^[A-Za-z0-9_-]+$/)
    .max(128)
    .required()
    .messages({
      'string.pattern.base': 'name contains invalid characters.',
      'string.max': 'name is too long',
      'any.required': 'name required',
    }),
  password: Joi.string()
    .pattern(/^[\x21-\x7E]+$/)
    .min(15)
    .max(99)
    .required()
    .messages({
      'string.pattern.base': 'password contains invalid characters',
      'string.min': 'password must be at least 12 characters long',
      'string.max': 'password is too long. must be <= 99',
      'any.required': 'password required',
    }),
  email: Joi.string().email().required().messages({
    'any.required': 'email required',
    'string.email': 'Email must be a valida address',
  }),
})

export default userSchema
