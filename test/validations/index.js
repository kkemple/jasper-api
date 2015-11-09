import Joi from 'joi'

export const authSuccessSchema = {
  success: Joi.boolean().invalid(false).required(),
  timestamp: Joi.date().required(),
  payload: {
    token: Joi.string().required(),
  },
}

export const userGetSuccessSchema = {
  success: Joi.boolean().invalid(false).required(),
  timestamp: Joi.date().required(),
  payload: Joi.object().keys({
    user: Joi.object().keys({
      id: Joi.number().required(),
      email: Joi.string().email().required(),
      active: Joi.boolean().required(),
      extra_data: Joi.string().allow(null).allow(''),
      created_at: Joi.date().required(),
      updated_at: Joi.date().required(),
      bots: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          user_id: Joi.number().required(),
          active: Joi.boolean().required(),
          name: Joi.string().required(),
          phone_number: Joi.string().required(),
          extra_data: Joi.string().allow(null).allow(''),
          created_at: Joi.date().required(),
          updated_at: Joi.date().required(),
        })
      ),
    }),
  }),
}

export const oauthSuccessSchema = {
  success: Joi.boolean().invalid(false).required(),
  timestamp: Joi.date().required(),
  payload: Joi.object().keys({
    id: Joi.number().required(),
    bot_id: Joi.number().required(),
    type: Joi.string().required(),
    access_token: Joi.string().token().required(),
    refresh_token: Joi.string().token().allow('').allow(null),
    expires_in: Joi.number().allow(null),
    active: Joi.boolean().required(),
    extra_data: Joi.string().allow('').allow(null),
    created_at: Joi.date().required(),
    updated_at: Joi.date().required(),
  }),
}

export const botGetSuccessSchema = {
  success: Joi.boolean().invalid(false).required(),
  timestamp: Joi.date().required(),
  payload: Joi.object().keys({
    bot: Joi.object().keys({
      id: Joi.number().required(),
      user_id: Joi.number().required(),
      active: Joi.boolean().required(),
      name: Joi.string().required(),
      phone_number: Joi.string().required(),
      extra_data: Joi.string().allow(null).allow(''),
      created_at: Joi.date().required(),
      updated_at: Joi.date().required(),
      integrations: Joi.array(),
      emails: Joi.array(),
    }),
  }),
}
