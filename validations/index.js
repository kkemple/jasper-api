import Joi from 'joi'

export const userValidation = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
  stripe_id: Joi.string(),
  extra_data: Joi.string(),
  active: Joi.boolean(),
}

export const authenticationPayload = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
}

export const headers = Joi.object({
  'x-access-token': Joi.string().required(),
}).options({ allowUnknown: true })

export const userPostPayload = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
}

export const userParams = {
  id: Joi.number().required(),
}

export const botPostPayload = {
  name: Joi.string().required(),
  phone_number: Joi.string().required(),
  user_id: Joi.number().required(),
}

export const botParams = {
  userId: Joi.number().required(),
  botId: Joi.number().required(),
}

export const integrationPostPayload = {
  type: Joi.string().required(),
  access_token: Joi.string().required(),
  refresh_token: Joi.string(),
  expires_in: Joi.number(),
}

export const integrationParams = {
  userId: Joi.number().required(),
  botId: Joi.number().required(),
  integrationId: Joi.number().required(),
}

export const emailPostPayload = {
  email: Joi.string().email().required(),
}

export const emailParams = {
  userId: Joi.number().required(),
  botId: Joi.number().required(),
  emailId: Joi.number().required(),
}
