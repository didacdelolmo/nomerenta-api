import { describe } from 'mocha';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';
import CounterModel from '../src/models/counter-model.mjs';

describe('Counter endpoints', () => {
  before(async () => {
    const counter = await CounterModel.findOne({});
    counter.count = 0;
    await counter.save();
  });

  it('Should increment the visit count 5 times', async () => {
    let response = await supertest(app).patch('/counter/increment');
    response = await supertest(app).patch('/counter/increment');
    response = await supertest(app).patch('/counter/increment');
    response = await supertest(app).patch('/counter/increment');
    response = await supertest(app).patch('/counter/increment');

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.count, 5);
  });
});
