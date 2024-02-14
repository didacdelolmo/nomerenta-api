import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';

class Role {
  canChangeAvatar() {
    throw new IdentifiedError(
      ErrorCode.INVALID_ROLE_PERMISSION,
      'Permisos de rol inválidos'
    );
  }
}

export default Role;
