import express from 'express';
import { isAuthenticated } from '../middleware/is-authenticated.mjs';
import {
  validateAuthInput,
  validateAvatarInput,
} from '../validation/user-validation.mjs';
import upload from '../middleware/upload.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as userController from '../controllers/user-controller.mjs';

const router = express.Router();

router.post('/register', validateAuthInput, tryCatch(userController.register));

router.post('/login', validateAuthInput, tryCatch(userController.login));

router.post(
  '/users/me/avatar',
  isAuthenticated,
  validateAvatarInput,
  upload.single('avatar'),
  tryCatch(userController.updateAvatar)
);

export default router;
