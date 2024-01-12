import './config/database.mjs';
import express from 'express';
import { sessionHandler } from './config/session-handler.mjs';
import userRouter from './routers/user-router.mjs';

const app = express();

app.use(sessionHandler);

app.use(userRouter);

export default app;
