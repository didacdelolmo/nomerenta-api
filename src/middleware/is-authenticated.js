import ErrorCode from '../errors/error-code';
import IdentifiedError from '../errors/identified-error';

export const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    throw new IdentifiedError(ErrorCode.UNAUTHORIZED, 'Unauthorized');
  }
  next();
};
