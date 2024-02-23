import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import * as invitationController from '../controllers/invitation-controller.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import { validateCreateInvitationsInput } from '../validation/invitation-validation.mjs';

const router = express.Router();

router.get(
  '/users/me/invitations',
  isAuthenticated,
  tryCatch(invitationController.getCurrentUserInvitations)
);

router.post(
  '/users/me/invitations',
  isAuthenticated,
  validateCreateInvitationsInput,
  tryCatch(invitationController.createCurrentUserInvitations)
);

export default router;
