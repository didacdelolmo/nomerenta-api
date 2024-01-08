import * as userService from '../services/user-service';

export async function updateAvatar(req, res, next) {
  res.send(await userService.setAvatar(req.session.userId, req.file.path));
}
