import argon2 from 'argon2';
import * as userService from './user-service.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';
import crypto from 'crypto';
import RoleIdentifier from '../roles/role-identifier.mjs';

export async function register({
  username,
  password,
  roleId = RoleIdentifier.MEMBER,
  anonymous = false,
}) {
  if (username.length >= 16) {
    throw new IdentifiedError(
      ErrorCode.USERNAME_TOO_LONG,
      'Nombre demasiado largo'
    );
  }

  const existsUser = await userService.existsUsername(username);
  if (existsUser) {
    throw new IdentifiedError(ErrorCode.USERNAME_TAKEN, 'Nombre ocupado');
  }

  const hashedPassword = await argon2.hash(password);

  const user = await userService.create(
    username,
    hashedPassword,
    roleId,
    anonymous
  );

  return user.withoutHashedPassword();
}

export async function registerAnonimously() {
  const count = await userService.countAnonymous();
  const username = `Anónimo ${count + 1}`;
  const password = crypto.randomBytes(20).toString('base64');

  return register({ username, password, anonymous: true });
}

export async function login({ username, password }) {
  const user = await userService.getByUsername(username, true);
  if (!user) {
    throw new IdentifiedError(
      ErrorCode.INVALID_CREDENTIALS,
      'Credenciales invalidas'
    );
  }

  const matchesPassword = await argon2.verify(user.hashedPassword, password);
  if (!matchesPassword) {
    throw new IdentifiedError(
      ErrorCode.INVALID_CREDENTIALS,
      'Credenciales invalidas'
    );
  }

  userService.tryToApplyPremium(user);

  return user.withoutHashedPassword();
}
