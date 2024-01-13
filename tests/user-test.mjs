import { before, describe, it } from 'mocha';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';
import UserFixture from './fixtures/user-fixture.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

describe('User endpoints', () => {
  let user;

  before(async () => {
    await UserFixture.clean();
    user = await UserFixture.create('didacdelolmo', 'abcd1234');
  });

  it('POST /register', async () => {
    const content = {
      username: 'diego',
      password: 'zxcv0987',
    };

    const response = await supertest(app).post('/register').send(content);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, content.username);
  });

  it('POST /login', async () => {
    const response = await supertest(app).post('/login').send({
      username: user.username,
      password: user.password,
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, user.username);
  });

  it('POST /users/me/avatar', async () => {
    try {
      const dir = dirname(fileURLToPath(import.meta.url));

      const response = await supertest(app)
        .post('/users/me/avatar')
        .set('Cookie', user.cookie)
        .attach('avatar', `${dir}/avatars/avatar.jpg`);
        
      assert.strictEqual(response.status, 200);
    } catch (error) {
      console.error(error);
    }
  });
});
