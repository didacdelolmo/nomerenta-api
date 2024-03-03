import { before, describe } from 'mocha';
import supertest from 'supertest';
import app from '../src/app.mjs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../src/models/user-model.mjs';
import UserFixture from './fixtures/user-fixture.mjs';
import assert from 'assert';
import RoleIdentifier from '../src/roles/role-identifier.mjs';

describe('Image endpoints', () => {
  let user;

  before(async () => {
    await UserModel.deleteMany({});

    user = await UserFixture.create('cat', 'kitten123', RoleIdentifier.PREMIUM);
  });

  it(`Should upload an image`, async () => {
    const pathString = fileURLToPath(import.meta.url);
    const dirString = dirname(pathString);
    const absolutePath = resolve(dirString, 'images/cat.jpg');

    const response = await supertest(app)
      .post('/images')
      .set('Cookie', user.cookie)
      .attach('image', absolutePath);
    assert.strictEqual(response.status, 200);
  });
});
