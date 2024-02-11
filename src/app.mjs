import './config/database.mjs';
import express from 'express';
import { sessionHandler } from './config/session-handler.mjs';
import userRouter from './routers/user-router.mjs';
import postRouter from './routers/post-router.mjs';
import commentRouter from './routers/comment-router.mjs';
import { errorHandler } from './errors/error-handler.mjs';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ['http://127.0.0.1:5173', 'https://nomerenta.com'];

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

app.use(errorHandler);

export default app;
