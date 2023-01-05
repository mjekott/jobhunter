import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4000),
  MONGODB_URI: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
})
