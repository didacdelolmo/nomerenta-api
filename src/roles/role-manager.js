import Member from './member';
import Premium from './premium';
import RoleIdentifier from './role-identifier';

class RoleManager {
  static roles = {
    [RoleIdentifier.MEMBER]: new Member(),
    [RoleIdentifier.PREMIUM]: new Premium(),
  };

  static getRole(roleId) {
    return this.roles[roleId] ?? null;
  }
}

export default RoleManager;
