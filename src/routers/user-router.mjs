import express from 'express';
import {
  validateAuthInput,
  validateAvatarInput,
} from '../validation/user-validation.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as userController from '../controllers/user-controller.mjs';
import { uploadAvatar } from '../middleware/upload-avatar.mjs';
import isAuthenticated from '../middleware/is-authenticated.mjs';

const router = express.Router();

router.post('/register', validateAuthInput, tryCatch(userController.register));

router.post('/login', validateAuthInput, tryCatch(userController.login));

router.post(
  '/users/me/avatar',
  isAuthenticated,
  uploadAvatar,
  validateAvatarInput,
  tryCatch(userController.updateAvatar)
);

export default router;
