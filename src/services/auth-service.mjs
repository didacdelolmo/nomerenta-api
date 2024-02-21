import argon2 from 'argon2';
import * as userService from './user-service.mjs';
import * as invitationService from './invitation-service.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';
import RoleIdentifier from '../roles/role-identifier.mjs';
import UserModel from '../models/user-model.mjs';

export async function register({
  username,
  password,
  roleId = RoleIdentifier.MEMBER,
  code,
}) {
  if (username.length >= 16) {
    throw new IdentifiedError(
      ErrorCode.USERNAME_TOO_LONG,
      'Nombre demasiado largo'
    );
  }

  const existsUser = await userService.existsUsername(username);
  if (existsUser) {
    throw new IdentifiedError(
      ErrorCode.USERNAME_TAKEN,
      'Este nombre está ocupado'
    );
  }

  let invitation = await invitationService.getByCode(code);
  if (!invitation) {
    throw new IdentifiedError(
      ErrorCode.INVALID_INVITATION,
      'Esta invitación no existe'
    );
  } else if (!invitation.reusable && invitation.redeemed) {
    throw new IdentifiedError(
      ErrorCode.INVITATION_ALREADY_REDEEMED,
      'Esta invitación ya ha sido usada'
    );
  } else if (
    invitation.expirationDate &&
    invitation.expirationDate < new Date()
  ) {
    throw new IdentifiedError(
      ErrorCode.INVITATION_EXPIRED,
      'Esta invitación ha caducado'
    );
  }

  const hashedPassword = await argon2.hash(password);

  const user = new UserModel({
    username,
    hashedPassword,
    roleId,
  });

  invitation.target = user._id;
  invitation.redeemed = true;

  user.redeemedInvitation = invitation;

  await user.save();
  await invitation.save();

  return user.withoutHashedPassword();
}

export async function login({ username, password }) {
  const user = await userService.getByUsername(username, true);
  if (!user) {
    throw new IdentifiedError(
      ErrorCode.INVALID_CREDENTIALS,
      'Credenciales inválidas'
    );
  }

  const matchesPassword = await argon2.verify(user.hashedPassword, password);
  if (!matchesPassword) {
    throw new IdentifiedError(
      ErrorCode.INVALID_CREDENTIALS,
      'Credenciales inválidas'
    );
  }

  userService.tryToApplyPremium(user);

  return user.withoutHashedPassword();
}
