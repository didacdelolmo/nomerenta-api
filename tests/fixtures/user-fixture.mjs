import UserModel from '../../src/models/user-model.mjs';
import * as userService from '../../src/services/user-service.mjs';
import * as authService from '../../src/services/auth-service.mjs';
import supertest from 'supertest';
import app from '../../src/app.mjs';
import RoleIdentifier from '../../src/roles/role-identifier.mjs';
import InvitationFixture from './invitation-fixture.mjs';

class UserFixture {
  _id;
  cookie;
  username;
  password;
  roleId;
  code;

  constructor(username, password, roleId, code) {
    this.username = username;
    this.password = password;
    this.roleId = roleId;
    this.code = code;
  }

  static async create(username, password, roleId = RoleIdentifier.MEMBER) {
    const invitation = await InvitationFixture.create({});

    const user = new this(username, password, roleId, invitation.code);
    await user.authenticate();
    return user;
  }

  static async clean() {
    return UserModel.deleteMany({});
  }

  async get() {
    return userService.getById(this._id);
  }

  async authenticate() {
    await this.register();
    await this.login();
  }

  async register() {
    await authService.register({
      username: this.username,
      password: this.password,
      roleId: this.roleId,
      code: this.code,
    });
  }

  async login() {
    const response = await supertest(app).post('/login').send({
      username: this.username,
      password: this.password,
    });

    this._id = response.body._id;
    this.cookie = response.headers['set-cookie'];
  }
}

export default UserFixture;
