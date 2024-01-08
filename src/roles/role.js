import ErrorCode from '../errors/error-code';
import IdentifiedError from '../errors/identified-error';

class Role {
  canChangeAvatar() {
    throw new IdentifiedError(
      ErrorCode.INVALID_ROLE_PERMISSION,
      'Invalid role permission'
    );
  }
}

export default Role;
