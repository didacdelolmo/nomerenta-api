import './config/database.mjs';
import express from 'express';
import { sessionHandler } from './config/session-handler.mjs';
import userRouter from './routers/user-router.mjs';
import postRouter from './routers/post-router.mjs';
import { errorHandler } from './errors/error-handler.mjs';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessionHandler);
app.use(errorHandler);

app.use('/avatars', express.static('assets/avatars'));

app.use(userRouter);
app.use(postRouter);

export default app;
