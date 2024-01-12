import Member from './member.mjs';
import Premium from './premium.mjs';
import RoleIdentifier from './role-identifier.mjs';

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
