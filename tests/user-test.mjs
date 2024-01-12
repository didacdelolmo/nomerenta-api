import { before, describe, it } from "mocha";
import UserModel from "../src/models/user-model.mjs";

describe('User endpoints', () => {
  before(async () => {
    UserModel.deleteMany({});
  })

  it('POST /register', async () => {
    // const response = await request
  })

  it('POST /login', async () => {

  });

  it('POST /users/me/avatar', async () => {

  })
})