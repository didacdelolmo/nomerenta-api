import session from 'express-session';
import RedisStore from 'connect-redis';
import { Redis } from 'ioredis';

const {
  NODE_ENV,
  EXPRESS_SESSION_SECRET,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_PASSWORD,
} = process.env;

const sessionHandler = session({
  secret: EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({
    client: new Redis({
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    }),
  }),
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
});

export { sessionHandler };
