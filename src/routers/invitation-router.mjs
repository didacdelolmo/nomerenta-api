import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import * as invitationController from '../controllers/invitation-controller.mjs';
import { tryCatch } from '../utils/try-catch.mjs';

const router = express.Router();

router.post(
  '/users/me/invitations',
  isAuthenticated,
  tryCatch(invitationController.createCurrentUserInvitations)
);

export default router;
