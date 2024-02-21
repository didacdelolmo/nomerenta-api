import * as userService from '../services/user-service.mjs';
import * as authService from '../services/auth-service.mjs';
import { authenticate } from '../utils/auth.mjs';

export async function register(req, res) {
  const user = await authService.register(req.body);
  authenticate(user, req);
  res.send(user);
}

export async function login(req, res) {
  const user = await authService.login(req.body);
  authenticate(user, req);
  res.send(user);
}

export async function getAllUsers(req, res) {
  res.send(await userService.getAll(req.body.username, req.body.start));
}

export async function getCurrentUser(req, res) {
  res.send(await userService.getById(req.session.userId));
}

export async function getUser(req, res) {
  res.send(await userService.getById(req.params.id));
}

export async function updateAvatar(req, res) {
  res.send(await userService.setAvatar(req.session.userId, req.file));
}

export async function getFollows(req, res) {
  res.send(await userService.getFollows(req.session.userId));
}

export async function getFollowers(req, res) {
  res.send(await userService.getFollowers(req.session.userId));
}

export async function follow(req, res) {
  res.send(await userService.follow(req.session.userId, req.params.id));
}

export async function unfollow(req, res) {
  res.send(await userService.unfollow(req.session.userId, req.params.id));
}

export async function setOutsiderBiography(req, res) {
  res.send(
    await userService.setOutsiderBiography(
      req.session.userId,
      req.params.id,
      req.body.biography
    )
  );
}

export async function setOutsiderFlair(req, res) {
  res.send(
    await userService.setOutsiderFlair(
      req.session.userId,
      req.params.id,
      req.body.flair
    )
  );
}
