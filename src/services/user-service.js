import sharp from 'sharp';
import ErrorCode from '../errors/error-code';
import IdentifiedError from '../errors/identified-error';
import UserModel from '../models/user-model';
import sanitize from 'sanitize-filename';
import fs from 'fs';

export async function getById(userId) {
  return UserModel.findById(userId);
}

export async function setAvatar(userId, avatar) {
  const user = await getById(userId);
  if (!user) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Invalid user');
  }

  const sanitizedAvatar = sanitize(avatar);
  await sharp(sanitizedAvatar).resize(128, 128).toFile(sanitizedAvatar);

  const stats = await fs.stat(sanitizedAvatar);

  const fileSizeInBytes = stats.size;
  const maxSizeInBytes = 1024 * 1024;

  if (fileSizeInBytes > maxSizeInBytes) {
    throw new IdentifiedError(ErrorCode.IMAGE_TOO_BIG, 'Image is too big');
  }

  user.avatar = sanitizedAvatar;
  await user.save();

  console.log(
    `📷 [user-service]: Updated the avatar from user ${user.username}`,
    user
  );

  return user;
}
