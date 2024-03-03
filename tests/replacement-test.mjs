import { describe } from 'mocha';
import supertest from 'supertest';
import app from '../src/app.mjs';
import assert from 'assert';
import UserModel from '../src/models/user-model.mjs';
import UserFixture from './fixtures/user-fixture.mjs';
import RoleIdentifier from '../src/roles/role-identifier.mjs';

describe('Replacement endpoints', () => {
  let dictator;

  before(async () => {
    await UserModel.deleteMany({});

    dictator = await UserFixture.create(
      'dictator',
      'abcd1234',
      RoleIdentifier.DICTATOR
    );
  });

  it('Should get an empty list of replacements', async () => {
    const response = await supertest(app).get('/replacements');

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.replacements.length, 0);
  });

  it('Should update the whole replacement list', async () => {
    const response = await supertest(app)
      .put('/replacements')
      .send({
        replacements: [
          {
            originalText: 'a',
            replacement: 'b',
          },
          {
            originalText: 'c',
            replacement: 'd',
          },
          {
            originalText: 'e',
            replacement: 'f',
          },
          {
            originalText: 'j',
            replacement: 'k',
          },
        ],
      })
      .set('Cookie', dictator.cookie);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.replacements.length, 4);
  });
});
