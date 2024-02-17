import Premium from './premium.mjs';

class Admin extends Premium {
  canSetBiography = true;
  canSetOutsiderBiography = true;
  canSetFlair = true;
  canSetOutsiderFlair = true;
  canFeaturePosts = true;
}

export default Admin;
