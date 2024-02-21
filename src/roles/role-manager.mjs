import Dealer from './presets/dealer.mjs';
import Dictator from './presets/dictator.mjs';
import Editor from './presets/editor.mjs';
import Judge from './presets/judge.mjs';
import Member from './presets/member.mjs';
import PoliceOfficer from './presets/police-officer.mjs';
import Premium from './presets/premium.mjs';
import Professor from './presets/professor.mjs';
import RoleIdentifier from './role-identifier.mjs';

class RoleManager {
  static roles = {
    [RoleIdentifier.MEMBER]: new Member(),
    [RoleIdentifier.PREMIUM]: new Premium(),
    [RoleIdentifier.EDITOR]: new Editor(),
    [RoleIdentifier.JUDGE]: new Judge(),
    [RoleIdentifier.POLICE_OFFICER]: new PoliceOfficer(),
    [RoleIdentifier.PROFESSOR]: new Professor(),
    [RoleIdentifier.DEALER]: new Dealer(),
    [RoleIdentifier.DICTATOR]: new Dictator(),
  };

  static getRole(roleId) {
    return this.roles[roleId] ?? null;
  }
}

export default RoleManager;
