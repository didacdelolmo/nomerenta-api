import Role from "./role.mjs";

class Member extends Role {
  canChangeAvatar() {
    return false;
  }
}

export default Member;