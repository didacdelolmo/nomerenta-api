import express from 'express';
import { tryCatch } from '../utils/try-catch.mjs';
import CounterModel from '../models/counter-model.mjs';

const router = express.Router();

router.patch(
  '/counter/increment',
  tryCatch(async (req, res) => {
    const counter = await CounterModel.findOne();

    counter.count = counter.count + 1;
    await counter.save();

    res.send(counter);
  })
);

export default router;
