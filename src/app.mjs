import './config/database.mjs';
import express from 'express';
import { sessionHandler } from './config/session-handler.mjs';
import userRouter from './routers/user-router.mjs';
import notificationRouter from './routers/notification-router.mjs';
import postRouter from './routers/post-router.mjs';
import counterRouter from './routers/counter-router.mjs';
import commentRouter from './routers/comment-router.mjs';
import { errorHandler } from './errors/error-handler.mjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeCounter } from './config/counter.mjs';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

initializeCounter().catch((error) => {
  console.error('❌ [counter]: Something went wrong:', error);
});

const app = express();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://127.0.0.1:5173',
  'https://nomerenta.com',
  'https://nomerenta-app.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(sessionHandler);

app.use('/avatars', express.static('assets/avatars'));

app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);
app.use(notificationRouter);
app.use(counterRouter);

app.use(errorHandler);

export default app;
