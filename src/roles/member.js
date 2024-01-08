import Role from "./role";

class Member extends Role {
  canChangeAvatar() {
    return false;
  }
}

export default Member;