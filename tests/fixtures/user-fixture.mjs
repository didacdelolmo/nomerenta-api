import UserModel from '../../src/models/user-model.mjs';
import * as userService from '../../src/services/user-service.mjs';
import * as authService from '../../src/services/auth-service.mjs';
import supertest from 'supertest';
import app from '../../src/app.mjs';

class UserFixture {
  _id;
  cookie;
  username;
  password;

  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  static async create(username, password) {
    const user = new this(username, password);
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
