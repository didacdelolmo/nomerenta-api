import { before, describe, it } from 'mocha';
import UserFixture from './fixtures/user-fixture.mjs';
import PostFixture from './fixtures/post-fixture.mjs';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';
import RoleIdentifier from '../src/roles/role-identifier.mjs';

describe('Post endpoints', () => {
  let user;
  let admin;

  let post1;
  let post2;

  before(async () => {
    await UserFixture.clean();
    await PostFixture.clean();

    user = await UserFixture.create('diego', 'hjkl6789');
    admin = await UserFixture.create('admin', 'admin', RoleIdentifier.ADMIN);

    post1 = await PostFixture.create(
      user._id,
      'la navidad',
      'la navidad es mala'
    );
    post2 = await PostFixture.create(
      user._id,
      'salir de casa',
      'vivimos en una sociedad'
    );
  });

  it('Should get all posts filtered by score with a limit of 2 results', async () => {
    const response = await supertest(app).get('/posts?sortBy=score&limit=2');

    assert.strictEqual(response.status, 200);
  });

  it('Should get all posts filtered by most recent with a limit of 1 result', async () => {
    const response = await supertest(app).get(
      '/posts?sortBy=createdAt&start=0&limit=1'
    );

    console.log('response is', response.body);

    assert.strictEqual(response.status, 200);
  });

  it('Should get a post by id', async () => {
    const response = await supertest(app).get(`/posts/${post1._id}`);

    assert.strictEqual(response.status, 200);
  });

  it('Should get all the posts from a user', async () => {
    const response = await supertest(app).get(`/users/${user._id}/posts`);

    assert.strictEqual(response.status, 200);
  });

  it('Should get all posts from the logged in user', async () => {
    const response = await supertest(app)
      .get(`/users/me/posts`)
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });

  it('Should create a new post in behalf of the logged in user', async () => {
    const response = await supertest(app)
      .post(`/users/me/posts`)
      .set('Cookie', user.cookie)
      .send({
        title: 'el verano',
        content: 'el verano es malo',
      });

    assert.strictEqual(response.status, 200);
  });

  it('Should upvote a post', async () => {
    const response = await supertest(app)
      .patch(`/posts/${post1._id}/upvote`)
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });

  it('Should downvote a post', async () => {
    const response = await supertest(app)
      .patch(`/posts/${post1._id}/downvote`)
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });

  it('Should upvote a post and then downvote it', async () => {
    const firstResponse = await supertest(app)
      .patch(`/posts/${post2._id}/upvote`)
      .set('Cookie', user.cookie);
    const secondResponse = await supertest(app)
      .patch(`/posts/${post2._id}/downvote`)
      .set('Cookie', user.cookie);

    assert.strictEqual(firstResponse.status, 200);
    assert.strictEqual(secondResponse.status, 200);
  });

  it(`Should allow an administrator to set a post as featured`, async () => {
    const response = await supertest(app)
      .patch(`/posts/${post1._id}/feature`)
      .set('Cookie', admin.cookie);

    assert.strictEqual(response.status, 200);
  });
});
