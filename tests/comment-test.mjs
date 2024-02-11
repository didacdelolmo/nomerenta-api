import { before, describe, it } from 'mocha';
import UserFixture from './fixtures/user-fixture.mjs';
import PostFixture from './fixtures/post-fixture.mjs';
import CommentFixture from './fixtures/comment-fixture.mjs';
import supertest from 'supertest';
import app from '../src/app.mjs';
import { strictEqual } from 'assert';

describe('Comment endpoints', () => {
  let user;
  let post;

  let comment1;
  let comment2;
  let comment3;
  let comment4;
  let comment5;
  let comment6;
  let comment7;

  before(async () => {
    await UserFixture.clean();
    await PostFixture.clean();
    await CommentFixture.clean();

    user = await UserFixture.create('juan', 'vbnm4567');
    post = await PostFixture.create(user._id, 'vivir', 'vivir es malo');

    comment1 = await CommentFixture.create(
      user._id,
      post._id,
      null,
      'estoy de acuerdo'
    );
    comment2 = await CommentFixture.create(
      user._id,
      post._id,
      comment1._id,
      'pues yo no lo estoy'
    );
    comment3 = await CommentFixture.create(
      user._id,
      post._id,
      comment1._id,
      'necesitas ayuda?'
    );
    comment4 = await CommentFixture.create(
      user._id,
      post._id,
      comment2._id,
      'y a mi que me cuentas'
    );
    comment5 = await CommentFixture.create(
      user._id,
      post._id,
      null,
      'todos nos vamos a morir'
    );
    comment6 = await CommentFixture.create(
      user._id,
      post._id,
      comment5._id,
      'en efecto'
    );
    comment7 = await CommentFixture.create(
      user._id,
      post._id,
      null,
      'vivir no es malo'
    );
  });

  it('Should retrieve all user comments', async () => {
    const response = await supertest(app).get(`/users/${user._id}/comments`);

    console.log('stfu', response.body);

    strictEqual(response.status, 200);
  });

  it('Should hierarchically get all comments from a post', async () => {
    const response = await supertest(app).get(`/posts/${post._id}/comments`);

    strictEqual(response.status, 200);
  });

  it('Should post a comment on behalf of a logged in user', async () => {
    const response = await supertest(app)
      .post(`/posts/${post._id}/comments`)
      .set('Cookie', user.cookie)
      .send({
        postId: post._id,
        parentId: comment7._id,
        content: 'si es',
      });

    strictEqual(response.status, 200);
  });
});
