import Joi from 'joi'

export const userValidation = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
  stripe_id: Joi.string(),
  extra_data: Joi.string(),
  active: Joi.boolean(),
}
