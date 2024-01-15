import sharp from 'sharp';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import UserModel from '../models/user-model.mjs';
import path, { resolve } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

export async function getById(userId) {
  return UserModel.findById(userId);
}

export async function getByUsername(username, includeHashedPassword = false) {
  return UserModel.findOne({ username }).select(
    includeHashedPassword ? '+hashedPassword' : '-hashedPassword'
  );
}

export async function exists(username) {
  return UserModel.exists({ username });
}

export async function create(username, hashedPassword) {
  const user = await UserModel.create({
    username,
    hashedPassword,
  });

  console.log(
    `🌺 [user-service]: Created a new user with username ${username}`,
    user
  );

  return user;
}

export async function setAvatar(userId, avatar) {
  const user = await getById(userId);
  if (!user) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Invalid user');
  }

  const pathString = fileURLToPath(import.meta.url);
  const dirString = dirname(pathString);

  const absolutePathResized = resolve(
    dirString,
    `../../assets/avatars/${userId}${path.extname(avatar)}`
  );
  const absolutePathSanitized = resolve(
    dirString,
    `../../assets/avatars/${userId}-sanitized${path.extname(avatar)}`
  );

  const resizeResult = await sharp(avatar)
    .resize(128, 128)
    .toFile(absolutePathResized);

  await fs.unlink(absolutePathSanitized);

  if (resizeResult.size > 1024 * 1024) {
    await fs.unlink(absolutePathResized);
    throw new IdentifiedError(ErrorCode.IMAGE_TOO_BIG, 'Image is too big');
  }

  user.avatar = `${userId}${path.extname(avatar)}`;
  await user.save();

  console.log(
    `📷 [user-service]: Updated the avatar for user ${user.username}`,
    user
  );

  return user;
}
