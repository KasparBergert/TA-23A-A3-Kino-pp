import Joi from 'joi'

const userSchema = Joi.object({
  id: Joi.number().messages({
    'number.base': 'Id is not a number or could not be cast to a number',
  }),
  password: Joi.string()
    .pattern(/^[\x21-\x7E]+$/)
    .max(99)
    .required()
    .messages({
      'string.pattern.base': 'password contains invalid characters',
      'string.max': 'password is too long. must be <= 99',
      'any.required': 'password required',
    }),
  email: Joi.string().email().required().messages({
    'any.required': 'email required',
    'string.email': 'Email must be a valida address',
  }),
})

export default userSchema
