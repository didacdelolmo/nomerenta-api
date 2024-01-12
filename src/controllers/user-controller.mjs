import * as userService from '../services/user-service.mjs';
import * as authService from '../services/auth-service.mjs';
import { authenticate } from '../utils/auth.mjs';

export async function register(req, res) {
  res.send(await authService.register(req.body));
}

export async function login(req, res) {
  const user = await authService.login(req.body);
  authenticate(user, req);
  res.send(user);
}

export async function updateAvatar(req, res) {
  res.send(await userService.setAvatar(req.session.userId, req.file.path));
}
