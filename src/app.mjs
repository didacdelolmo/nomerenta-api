import './config/database.mjs';
import express from 'express';
import userRouter from './routers/user-router.mjs';
import notificationRouter from './routers/notification-router.mjs';
import postRouter from './routers/post-router.mjs';
import counterRouter from './routers/counter-router.mjs';
import commentRouter from './routers/comment-router.mjs';
import invitationRouter from './routers/invitation-router.mjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { sessionHandler } from './config/session-handler.mjs';
import { errorHandler } from './errors/error-handler.mjs';
import { initializeCounter } from './config/counter.mjs';
import { rateLimit } from 'express-rate-limit';
import { trackVisit } from './middleware/track-visit.mjs';

initializeCounter().catch((error) => {
  console.error('❌ [counter]: Something went wrong:', error);
});

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 500,
//   })
// );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://127.0.0.1:5173',
  'https://nomerenta.com',
  'https://www.nomerenta.com',
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
app.use(trackVisit);

app.use('/avatars', express.static('assets/avatars'));

app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);
app.use(notificationRouter);
app.use(counterRouter);
app.use(invitationRouter);

app.use(errorHandler);

export default app;
