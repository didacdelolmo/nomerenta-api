import Role from '../role.mjs';

class Premium extends Role {
  canSetAvatar = true;
  canFormatText = true;
  canUploadImage = true;
}

export default Premium;
