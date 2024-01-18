import sharp from 'sharp';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import UserModel from '../models/user-model.mjs';
import { fileURLToPath } from 'url';
import { dirname, extname, resolve } from 'path';
import sanitize from 'sanitize-filename';

export async function getById(userId) {
  return UserModel.findById(userId);
}

export async function getByUsername(username, includeHashedPassword = false) {
  return UserModel.findOne({ username }).select(
    includeHashedPassword ? '+hashedPassword' : '-hashedPassword'
  );
}

export async function existsId(userId) {
  return UserModel.exists({ _id: userId });
}

export async function existsUsername(username) {
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

  const sanitizedAvatar = sanitize(avatar.originalname);

  const pathString = fileURLToPath(import.meta.url);
  const dirString = dirname(pathString);

  const fileName = userId + extname(sanitizedAvatar);

  const absolutePath = resolve(dirString, `../../assets/avatars/${fileName}`);

  if (avatar.size > 1 * (1024 * 1024)) {
    throw new IdentifiedError(ErrorCode.IMAGE_TOO_BIG, 'Image is too big');
  }

  const resizeResult = await sharp(avatar.buffer)
    .resize(256, 256)
    .toFile(absolutePath);
  // Must double-check if sharp can replace files

  if (resizeResult.size > 1 * 1024 * 1024) {
    throw new IdentifiedError(ErrorCode.IMAGE_TOO_BIG, 'Image is too big');
  }

  user.avatar = fileName;
  await user.save();

  console.log(
    `📷 [user-service]: Updated the avatar for user ${user.username}`,
    user
  );

  return user;
}
