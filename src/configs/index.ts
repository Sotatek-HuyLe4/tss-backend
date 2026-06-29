import Joi from 'joi';

export const configSchema = Joi.object({
  // environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(8000),

  // database
  DATABASE_URL: Joi.string().default(
    'postgresql://admin:root@localhost:5432/tss_backend_db',
  ),
});

export default () => ({
  // environment
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT),

  // database
  databaseUrl: process.env.DATABASE_URL,
});
