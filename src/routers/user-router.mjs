import express from 'express';
import {
  validateAuthInput,
  validateAvatarInput,
  validateSetOutsiderBiographyInput,
  validateSetOutsiderFlairInput,
} from '../validation/user-validation.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as userController from '../controllers/user-controller.mjs';
import { uploadAvatar } from '../middleware/upload-avatar.mjs';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { validateId } from '../validation/params-validation.mjs';

const router = express.Router();

router.post('/register', validateAuthInput, tryCatch(userController.register));

router.post(
  '/registerAnonimously',
  tryCatch(userController.registerAnonimously)
);

router.post('/login', validateAuthInput, tryCatch(userController.login));

router.get(
  '/users/me',
  isAuthenticated,
  tryCatch(userController.getCurrentUser)
);

router.get('/users/:id', validateId, tryCatch(userController.getUser));

// Change to patch
router.patch(
  '/users/me/avatar',
  isAuthenticated,
  uploadAvatar,
  validateAvatarInput,
  tryCatch(userController.updateAvatar)
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
