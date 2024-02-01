import { before, describe, it } from 'mocha';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';
import UserFixture from './fixtures/user-fixture.mjs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

describe('User endpoints', () => {
  let user;

  before(async () => {
    await UserFixture.clean();
    user = await UserFixture.create('didacdelolmo', 'abcd1234');
  });

  it('Should register a new user', async () => {
    const content = {
      username: 'diego',
      password: 'zxcv0987',
    };

    const response = await supertest(app).post('/register').send(content);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, content.username);
  });

  it('Should NOT register a new user because the username is taken', async () => {
    const content = {
      username: 'Diego', // note how the D is uppercase
      password: 'zxcv0987',
    };

    const response = await supertest(app).post('/register').send(content);

    assert.strictEqual(response.status, 400);
  });

  it('Should login a user', async () => {
    const response = await supertest(app).post('/login').send({
      username: user.username,
      password: user.password,
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, user.username);
  });

  it('Should retrieve a user data', async () => {
    const response = await supertest(app)
      .get('/users/me')
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });

  it('Should set for the first time a user avatar', async () => {
    const pathString = fileURLToPath(import.meta.url);
    const dirString = dirname(pathString);
    const absolutePath = resolve(dirString, 'avatars/bed.png');

    const response = await supertest(app)
      .post('/users/me/avatar')
      .set('Cookie', user.cookie)
      .attach('avatar', absolutePath);

    assert.strictEqual(response.status, 200);
  });

  it('Should update a user avatar', async () => {
    const pathString = fileURLToPath(import.meta.url);
    const dirString = dirname(pathString);
    const absolutePath = resolve(dirString, 'avatars/doublebed.png');

    const response = await supertest(app)
      .post('/users/me/avatar')
      .set('Cookie', user.cookie)
      .attach('avatar', absolutePath);

    assert.strictEqual(response.status, 200);
  });

  it('Should NOT update a user avatar because the image is too big', async () => {
    const pathString = fileURLToPath(import.meta.url);
    const dirString = dirname(pathString);
    const absolutePath = resolve(dirString, 'avatars/30mb.jpg');

    const response = await supertest(app)
      .post('/users/me/avatar')
      .set('Cookie', user.cookie)
      .attach('avatar', absolutePath);

    assert.strictEqual(response.status, 400);
  });
});
