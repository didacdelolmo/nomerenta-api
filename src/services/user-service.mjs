import sharp from 'sharp';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import sanitize from 'sanitize-filename';
import fs from 'fs';
import UserModel from '../models/user-model.mjs';

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
  console.log('2');

  const sanitizedAvatar = sanitize(avatar);
  await sharp(sanitizedAvatar).resize(128, 128).toFile(sanitizedAvatar);

  const stats = await fs.stat(sanitizedAvatar);

  console.log('3');

  const fileSizeInBytes = stats.size;
  const maxSizeInBytes = 1024 * 1024;

  if (fileSizeInBytes > maxSizeInBytes) {
    throw new IdentifiedError(ErrorCode.IMAGE_TOO_BIG, 'Image is too big');
  }

  console.log('4');


  user.avatar = sanitizedAvatar;
  await user.save();

  console.log('5');


  console.log(
    `📷 [user-service]: Updated the avatar from user ${user.username}`,
    user
  );

  return user;
}
