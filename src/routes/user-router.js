import express from 'express';
import { isAuthenticated } from '../middleware/is-authenticated';
import { validateAvatarInput } from '../validation/user-validation';
import upload from '../middleware/upload';
import { tryCatch } from '../utils/try-catch';
import * as userController from '../controllers/user-controller';

const router = express.Router();

router.post(
  '/users/me/avatar',
  isAuthenticated,
  validateAvatarInput,
  upload.single('avatar'),
  tryCatch(userController.updateAvatar)
);

export default router;
