import Admin from './presets/admin.mjs';
import Boss from './presets/boss.mjs';
import Member from './presets/member.mjs';
import Premium from './presets/premium.mjs';
import RoleIdentifier from './role-identifier.mjs';

class RoleManager {
  static roles = {
    [RoleIdentifier.MEMBER]: new Member(),
    [RoleIdentifier.PREMIUM]: new Premium(),
    [RoleIdentifier.ADMIN]: new Admin(),
    [RoleIdentifier.BOSS]: new Boss(),
  };

  static getRole(roleId) {
    return this.roles[roleId] ?? null;
  }
}

export default RoleManager;
