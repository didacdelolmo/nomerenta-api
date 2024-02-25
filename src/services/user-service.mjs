import sharp from 'sharp';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import UserModel from '../models/user-model.mjs';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { dirname, extname, resolve } from 'path';
import sanitize from 'sanitize-filename';
import RoleManager from '../roles/role-manager.mjs';
import RoleIdentifier from '../roles/role-identifier.mjs';
import * as notificationService from './notification-service.mjs';
import Stripe from 'stripe';
import constants from '../config/constants.mjs';
import Premium from '../roles/presets/premium.mjs';

const { STRIPE_API_KEY } = process.env;
const stripe = new Stripe(STRIPE_API_KEY);

export async function getById(userId, includeHashedPassword = false) {
  return UserModel.findById(userId).select(
    includeHashedPassword ? '+hashedPassword +followers' : '-hashedPassword +followers'
  )
}

export async function getByUsername(username, includeHashedPassword = false) {
  return UserModel.findOne({ username }).select(
    includeHashedPassword ? '+hashedPassword' : '-hashedPassword'
  );
}

export async function getFollows(userId) {
  return UserModel.findById(userId).select('following').populate('following');
}

export async function getFollowers(userId) {
  return UserModel.findById(userId).select('followers').populate('followers');
}

export async function getAll(username, start = 0) {
  const limit = 20;
  const page = parseInt(start, 10) || 0;
  const skip = page * limit;
  const regex = new RegExp(username, 'i');

  return UserModel.find({ username: regex }).limit(limit).skip(skip);
}

export async function existsId(userId) {
  return UserModel.exists({ _id: userId });
}

export async function existsUsername(username) {
  return UserModel.exists({ username: { $regex: new RegExp(username, 'i') } });
}

export async function countAnonymous() {
  return UserModel.countDocuments({ username: { $regex: /^Anónimo \d+$/ } });
}

export async function create(username, hashedPassword, roleId) {
  const user = await UserModel.create({
    username,
    hashedPassword,
    roleId,
  });

  console.log(
    `🌺 [user-service]: Created a new user with username ${username}`,
    user
  );

  return user;
}

export async function setRole(userId, roleId) {
  const user = await getById(userId);
  if (!user) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const role = RoleManager.getRole(roleId);
  if (role === null) {
    throw new IdentifiedError(ErrorCode.INVALID_ROLE, 'Este rol no existe');
  }

  user.roleId = roleId;

  await user.save();

  return user;
}

export async function setAvatar(userId, avatar) {
  const user = await getById(userId);
  if (!user) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const role = user.role;
  if (!role.canSetAvatar) {
    throw new IdentifiedError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'Cambia tu foto de perfil con PREMIUM'
    );
  }

  const sanitizedAvatar = sanitize(avatar.originalname);

  const pathString = fileURLToPath(import.meta.url);
  const dirString = dirname(pathString);

  const fileName = userId + extname(sanitizedAvatar);

  // Must create this folder first otherwise it throws error on production
  const absolutePath = resolve(dirString, `../../assets/avatars/${fileName}`);

  if (avatar.size > 1 * (1024 * 1024)) {
    throw new IdentifiedError(
      ErrorCode.IMAGE_TOO_BIG,
      'La imagen es demasiado grande'
    );
  }

  const resizeResult = await sharp(avatar.buffer)
    .resize(256, 256)
    .toFile(absolutePath);

  if (resizeResult.size > 1 * 1024 * 1024) {
    throw new IdentifiedError(
      ErrorCode.IMAGE_TOO_BIG,
      'La imagen es demasiado grande'
    );
  }

  user.avatar = fileName;
  await user.save();

  console.log(
    `📷 [user-service]: Updated the avatar for user ${user.username}`,
    user
  );

  return user;
}

export async function follow(userId, targetId) {
  const user = await UserModel.findById(userId).select('+following');
  const target = await UserModel.findById(targetId).select('followers');

  if (!user || !target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe');
  }

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
  }
  if (!target.followers.includes(userId)) {
    target.followers.push(userId);
  }

  await user.save();
  await target.save();

  return user;
}

export async function unfollow(userId, targetId) {
  const user = await UserModel.findById(userId).select('+following');
  const target = await UserModel.findById(targetId).select('followers');

  if (!user || !target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe');
  }

  user.following = user.following.filter(
    (follow) => follow.toString() !== targetId
  );
  target.followers = target.followers.filter(
    (follow) => follow.toString() !== userId
  );

  await user.save();
  await target.save();

  return user;
}

export async function setOutsiderFlair(userId, targetId, content) {
  const user = await UserModel.findById(userId).select('+actions');
  const target = await getById(targetId);

  if (!user || !target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const role = user.role;
  if (!role.canSetOutsiderFlair) {
    throw new IdentifiedError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'No tienes permisos para realizar esta acción'
    );
  }

  if (!canPerformAction(user, 'flair')) {
    throw new IdentifiedError(
      ErrorCode.REACHED_ACTION_LIMIT,
      'Has llegado al limite de veces que puedes realizar esta acción diariamente'
    );
  }

  target.flair = content;
  user.actions.flair.push({ date: new Date(), target: target._id });

  await target.save();
  await user.save();

  console.log(
    `📷 [user-service]: Editor ${user.username} updated the biography for user ${target.username}`,
    target
  );

  return target;
}

export async function setOutsiderBiography(userId, targetId, content) {
  const user = await UserModel.findById(userId).select('+actions');
  const target = await getById(targetId);

  if (!user || !target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const role = user.role;
  if (!role.canSetOutsiderBiography) {
    throw new IdentifiedError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'No tienes permisos para realizar esta acción'
    );
  }

  if (!canPerformAction(user, 'biography')) {
    throw new IdentifiedError(
      ErrorCode.REACHED_ACTION_LIMIT,
      'Has llegado al limite diario de veces que puedes realizar esta acción'
    );
  }

  target.biography = content;
  user.actions.biography.push({ date: new Date(), target: target._id });

  await target.save();
  await user.save();

  console.log(
    `📷 [user-service]: Editor ${user.username} updated the biography for user ${target.username}`,
    target
  );

  return target;
}

export function canPerformAction(user, action) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limits = {
    flair: constants.DAILY_FLAIR_ACTIONS,
    biography: constants.DAILY_BIOGRAPHY_ACTIONS,
    featured: constants.DAILY_FEATURED_ACTIONS,
  };

  if (!(action in limits)) {
    throw new IdentifiedError(
      ErrorCode.INVALID_ACTION,
      'Esta acción no existe'
    );
  }

  const actionCounts =
    user.actions[action]?.filter((actionItem) => {
      const actionDate = new Date(actionItem.date);
      return actionDate >= today;
    }).length || 0;

  return actionCounts < limits[action];
}

export async function tryToApplyPremium(user) {
  const role = user.role;
  if (role instanceof Premium) {
    return;
  }

  const events = await stripe.events.list({
    type: 'checkout.session.completed',
  });

  if (
    events.data.some((event) => {
      const custom_fields = event.data.object.custom_fields;
      if (custom_fields) {
        return custom_fields.some((field) => {
          return (
            field.key === 'nombredeusuariodenomerentacom' &&
            field.text.value === user.username
          );
        });
      }
    })
  ) {
    user.roleId = RoleIdentifier.PREMIUM;

    await user.save();
    await notificationService.create({
      targetId: user._id,
      message: '¡Gracias por comprar PREMIUM! 🏆',
    });

    console.log(`🏆 [user-service]: ${user.username} has purchased PREMIUM!`);
  }
}
