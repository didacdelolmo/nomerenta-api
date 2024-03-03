import Premium from './premium.mjs';

class Dictator extends Premium {
  canSetOutsiderBiography = true;
  canSetOutsiderFlair = true;
  canFeaturePosts = true;
  canUpdateReplacements = true;
}

export default Dictator;
