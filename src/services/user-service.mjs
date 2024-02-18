import sharp from 'sharp';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import UserModel from '../models/user-model.mjs';
import { fileURLToPath } from 'url';
import { dirname, extname, resolve } from 'path';
import sanitize from 'sanitize-filename';
import RoleManager from '../roles/role-manager.mjs';
import Premium from '../roles/presets/premium.mjs';
import axios from 'axios';
import RoleIdentifier from '../roles/role-identifier.mjs';
import * as notificationService from './notification-service.mjs';

export async function getById(userId, includeHashedPassword = false) {
  return UserModel.findById(userId).select(
    includeHashedPassword ? '+hashedPassword' : '-hashedPassword'
  );
}

export async function getByUsername(username, includeHashedPassword = false) {
  return UserModel.findOne({ username }).select(
    includeHashedPassword ? '+hashedPassword' : '-hashedPassword'
  );
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

export async function create(username, hashedPassword, roleId, anonymous) {
  const user = await UserModel.create({
    username,
    hashedPassword,
    roleId,
    anonymous,
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

/**
 * * Calls gumroad API to know if there was a sale with the user id username
 */
export async function tryToApplyPremium(user) {
  const role = user.role;
  if (role instanceof Premium) {
    return;
  }

  const { GUMROAD_ACCESS_TOKEN } = process.env;
  const response = await axios.get('https://api.gumroad.com/v2/sales', {
    headers: { Authorization: `Bearer ${GUMROAD_ACCESS_TOKEN}` },
  });

  if (!response.data) {
    return;
    // Might consider throwing an error instead?
  }
  const sales = response.data.sales;

  if (
    sales.some(
      (sale) => sale.custom_fields['Nombre de usuario'] === user.username
    )
  ) {
    user.roleId = RoleIdentifier.PREMIUM;

    await user.save();
    await notificationService.create({
      targetId: user_id,
      message: '¡Gracias por comprar PREMIUM! 🏆',
    });

    console.log(`🏆 [user-service]: ${user.username} has purchased PREMIUM!`);
  }
}

export async function setOutsiderBiography(adminId, targetId, content) {
  const admin = await UserModel.findById(adminId).select('+actions');
  const target = await getById(targetId);

  if (!admin || !target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const role = admin.role;
  if (!role.canSetOutsiderBiography) {
    throw new IdentifiedError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'No tienes permisos para realizar esta acción'
    );
  }

  if (!canPerformAdminAction(admin, 'biography')) {
    throw new IdentifiedError(
      ErrorCode.REACHED_ACTION_LIMIT,
      'Has llegado al limite de veces que puedes realizar esta acción diariamente'
    );
  }

  target.biography = content;
  admin.actions.biography.push({ date: new Date(), target: target._id });

  await target.save();
  await admin.save();

  console.log(
    `📷 [user-service]: Administrator ${admin.username} updated the biography for user ${target.username}`,
    target
  );

  return target;
}

export async function setOutsiderFlair(adminId, targetId, content) {
  const admin = await UserModel.findById(adminId).select('+actions');
  const target = await getById(targetId);

  if (!admin || !target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const role = admin.role;
  if (!role.canSetOutsiderFlair) {
    throw new IdentifiedError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'No tienes permisos para realizar esta acción'
    );
  }

  if (!canPerformAdminAction(admin, 'flair')) {
    throw new IdentifiedError(
      ErrorCode.REACHED_ACTION_LIMIT,
      'Has llegado al limite de veces que puedes realizar esta acción diariamente'
    );
  }

  target.flair = content;
  admin.actions.flair.push({ date: new Date(), target: target._id });

  await target.save();
  await admin.save();

  console.log(
    `📷 [user-service]: Administrator ${admin.username} updated the biography for user ${target.username}`,
    target
  );

  return target;
}

export function canPerformAdminAction(user, action) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limits = {
    biography: 2,
    flair: 2,
    featured: 1,
  };

  if (!(action in limits)) {
    throw new IdentifiedError(
      ErrorCode.INVALID_ADMIN_ACTION,
      'Esta acción de administrador no existe'
    );
  }

  const actionCounts =
    user.actions[action]?.filter((actionItem) => {
      const actionDate = new Date(actionItem.date);
      return actionDate >= today;
    }).length || 0;

  return actionCounts < limits[action];
}
