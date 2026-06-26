import Joi from 'joi';

export const configSchema = Joi.object({
  // environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(8000),
});

export default () => ({
  // environment
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT),
});
