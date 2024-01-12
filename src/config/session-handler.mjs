import session from 'express-session';
import RedisStore from 'connect-redis';
import { Redis } from 'ioredis';
import crypto from 'crypto';

const {
  REDIS_PORT = 6379,
  REDIS_HOST = '127.0.0.1',
  REDIS_PASSWORD = '',
} = process.env;

const sessionHandler = session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  // store: new RedisStore({
  //   client: new Redis({
  //     port: +REDIS_PORT,
  //     host: REDIS_HOST,
  //     password: REDIS_PASSWORD,
  //   }),
  // }),
  // cookie: {
  //   secure: false,
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000
  // }
});

export { sessionHandler };
