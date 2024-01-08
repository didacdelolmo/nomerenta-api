import Role from './role';

class Premium extends Role {
  canChangeAvatar() {
    return true;
  }
}

export default Premium;
