import Role from './role.mjs';

class Premium extends Role {
  canChangeAvatar() {
    return true;
  }
}

export default Premium;
