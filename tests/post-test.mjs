import { before, describe, it } from 'mocha';
import UserFixture from './fixtures/user-fixture.mjs';
import PostFixture from './fixtures/post-fixture.mjs';
import supertest from 'supertest';
import app from '../src/app.mjs';
import { strictEqual } from 'assert';

describe('Post endpoints', () => {
  let user;
  let post;

  before(async () => {
    await UserFixture.clean();
    await PostFixture.clean();

    user = await UserFixture.create('diego', 'hjkl6789');
    post = await PostFixture.create(
      user._id,
      'la navidad',
      'la navidad es mala'
    );
  });

  it('GET /posts', async () => {
    const response = await supertest(app).get('/posts?sortBy=score&limit=2');

    strictEqual(response.status, 200);
  });

  it('GET /posts/:id', async () => {
    const response = await supertest(app).get(`/posts/${post._id}`);

    strictEqual(response.status, 200);
  });

  it('GET /users/:id/posts', async () => {
    const response = await supertest(app).get(`/users/${user._id}/posts`);

    strictEqual(response.status, 200);
  });

  it('GET /users/me/posts', async () => {
    const response = await supertest(app)
      .get(`/users/me/posts`)
      .set('Cookie', user.cookie);

    strictEqual(response.status, 200);
  });

  it('POST /users/me/posts', async () => {
    const response = await supertest(app)
      .post(`/users/me/posts`)
      .set('Cookie', user.cookie)
      .send({
        title: 'el verano',
        content: 'el verano es malo',
      });

    strictEqual(response.status, 200);
  });
});
