import 'dotenv/config';

export default {
  host: process.env.HOST ?? '127.0.0.1',
  port: process.env.PORT ?? 3000,

  redisHost: process.env.REDIS_HOST ?? '127.0.0.1',
  redisPort: process.env.REDIS_PORT ?? 6379,

  mongoHost: process.env.MONGO_HOST ?? '127.0.0.1',
  mongoPort: process.env.MONGO_PORT ?? 27017,

  sessionSecret: process.env.SESSION_SECRET ?? 'keyboard cat',

  maxSafeIntegerForGenerator: process.env.MAX_SAFE_INTEGER_FOR_GENERATOR
    ? Number(process.env.MAX_SAFE_INTEGER_FOR_GENERATOR)
    : Math.pow(2, 48),
}
