import express from 'express';
import {
  validateAvatarInput,
  validateGetUsersInput,
  validateLoginInput,
  validateRegisterInput,
  validateSetOutsiderBiographyInput,
  validateSetOutsiderFlairInput,
} from '../validation/user-validation.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as userController from '../controllers/user-controller.mjs';
import { uploadAvatar } from '../middleware/upload-avatar.mjs';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { validateId } from '../validation/params-validation.mjs';

const router = express.Router();

router.post(
  '/register',
  validateRegisterInput,
  tryCatch(userController.register)
);

router.post('/login', validateLoginInput, tryCatch(userController.login));

router.get(
  '/users',
  validateGetUsersInput,
  tryCatch(userController.getAllUsers)
);

router.get(
  '/users/me',
  isAuthenticated,
  tryCatch(userController.getCurrentUser)
);

router.get('/users/:id', validateId, tryCatch(userController.getUser));

router.patch(
  '/users/me/avatar',
  isAuthenticated,
  uploadAvatar,
  validateAvatarInput,
  tryCatch(userController.updateAvatar)
);

router.get(
  '/users/me/following',
  isAuthenticated,
  tryCatch(userController.getFollows)
);

router.get(
  '/users/me/followers',
  isAuthenticated,
  tryCatch(userController.getFollowers)
);

router.post(
  '/users/:id/follow',
  isAuthenticated,
  validateId,
  tryCatch(userController.follow)
);

router.post(
  '/users/:id/unfollow',
  isAuthenticated,
  validateId,
  tryCatch(userController.unfollow)
);

router.patch(
  '/users/:id/biography',
  isAuthenticated,
  validateId,
  validateSetOutsiderBiographyInput,
  tryCatch(userController.setOutsiderBiography)
);

router.patch(
  '/users/:id/flair',
  isAuthenticated,
  validateId,
  validateSetOutsiderFlairInput,
  tryCatch(userController.setOutsiderFlair)
);

export default router;
