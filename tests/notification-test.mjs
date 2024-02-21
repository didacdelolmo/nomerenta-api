import { before, describe } from 'mocha';
import UserFixture from './fixtures/user-fixture.mjs';
import PostFixture from './fixtures/post-fixture.mjs';
import CommentFixture from './fixtures/comment-fixture.mjs';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';

describe('Notification endpoints', () => {
  let user;
  let post;
  let comment;

  before(async () => {
    await UserFixture.clean();
    await PostFixture.clean();
    await CommentFixture.clean();

    user = await UserFixture.create('juan', 'uiop0987');
    post = await PostFixture.create(
      user._id,
      'testear el backend',
      'me tiene hasta los huevos'
    );
    comment = await CommentFixture.create(
      user._id,
      post._id,
      null,
      'espero que haya quedado claro'
    );
  });

  it('Should get all current user notifications', async () => {
    const response = await supertest(app)
      .get('/users/me/notifications')
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });

  it('Should get all user unseen notifications count', async () => {
    const response = await supertest(app)
      .get('/users/me/notifications/unseen/count')
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });

  it('Should mark all user notifications as seen', async () => {
    const response = await supertest(app)
      .patch('/users/me/notifications/seen')
      .set('Cookie', user.cookie);

    assert.strictEqual(response.status, 200);
  });
});
