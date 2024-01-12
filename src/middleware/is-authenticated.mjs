import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import { authenticated } from '../utils/auth.mjs';

export const isAuthenticated = (req, res, next) => {
  if (!authenticated) {
    throw new IdentifiedError(ErrorCode.UNAUTHORIZED, 'Unauthorized');
  }
  next();
};
