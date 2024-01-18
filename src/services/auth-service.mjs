import argon2 from 'argon2';
import * as userService from './user-service.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';

/** Have to double check if username checks are case sensitive */
export async function register({ username, password }) {
  const existsUser = await userService.existsUsername(username);
  if (existsUser) {
    throw new IdentifiedError(ErrorCode.USERNAME_TAKEN, 'Username is taken');
  }

  const hashedPassword = await argon2.hash(password);

  const user = await userService.create(username, hashedPassword);

  return user.withoutHashedPassword();
}

export async function login({ username, password }) {
  const user = await userService.getByUsername(username, true);
  if (!user) {
    throw new IdentifiedError(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid credentials'
    );
  }

  const matchesPassword = await argon2.verify(user.hashedPassword, password);
  if (!matchesPassword) {
    throw new IdentifiedError(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid credentials'
    );
  }

  return user.withoutHashedPassword();
}
