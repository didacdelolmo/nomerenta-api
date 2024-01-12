import { before, describe, it } from 'mocha';
import UserModel from '../src/models/user-model.mjs';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';

describe('User endpoints', () => {
  let credentials;

  before(async () => {
    await UserModel.deleteMany({});

    credentials = {
      username: 'didacdelolmo',
      password: 'abcd1234',
    };
  });

  it('POST /register', async () => {
    const response = await supertest(app).post('/register').send(credentials);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, credentials.username);
  });

  it('POST /login', async () => {});

  it('POST /users/me/avatar', async () => {});
});
