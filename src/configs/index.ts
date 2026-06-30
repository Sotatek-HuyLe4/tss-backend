import Joi from 'joi';
import { IConfigs } from './configs.interface';

export const configSchema = Joi.object({
  // environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(8080),

  // database
  DATABASE_URL: Joi.string().default(
    'postgresql://admin:root@localhost:5432/tss_backend_db',
  ),

  // tss
  TSS_NODE1_URL: Joi.string().default('http://localhost:8000'),
  TSS_NODE1_LISTEN_ADDRESS: Joi.string().default('/ip4/0.0.0.0/tcp/10000'),
  TSS_NODE1_HOME: Joi.string().default('node1'),
  TSS_NODE2_URL: Joi.string().default('http://localhost:8001'),
  TSS_NODE2_LISTEN_ADDRESS: Joi.string().default('/ip4/0.0.0.0/tcp/20000'),
  TSS_NODE2_HOME: Joi.string().default('node2'),
  TSS_NODE3_URL: Joi.string().default('http://localhost:8002'),
  TSS_NODE3_LISTEN_ADDRESS: Joi.string().default('/ip4/0.0.0.0/tcp/30000'),
  TSS_NODE3_HOME: Joi.string().default('node3'),
});

export default () =>
  ({
    // environment
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),

    // database
    databaseUrl: process.env.DATABASE_URL,

    // tss
    tss: [
      {
        url: process.env.TSS_NODE1_URL,
        listenAddress: process.env.TSS_NODE1_LISTEN_ADDRESS,
        home: process.env.TSS_NODE1_HOME,
      },
      {
        url: process.env.TSS_NODE2_URL,
        listenAddress: process.env.TSS_NODE2_LISTEN_ADDRESS,
        home: process.env.TSS_NODE2_HOME,
      },
      {
        url: process.env.TSS_NODE3_URL,
        listenAddress: process.env.TSS_NODE3_LISTEN_ADDRESS,
        home: process.env.TSS_NODE3_HOME,
      },
    ],
  }) as IConfigs;
