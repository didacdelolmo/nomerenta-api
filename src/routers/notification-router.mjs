import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as notificationController from '../controllers/notification-controller.mjs';
import { validateId } from '../validation/params-validation.mjs';

const router = express.Router();

router.get(
  '/users/me/notifications',
  isAuthenticated,
  tryCatch(notificationController.getCurrentUserNotifications)
);

router.get(
  '/users/me/notifications/unseen/count',
  isAuthenticated,
  tryCatch(notificationController.getCurrentUserUnseenNotificationsCount)
);

router.patch(
  '/users/me/notifications/seen',
  isAuthenticated,
  tryCatch(notificationController.markCurrentUserNotificationsAsSeen)
);

router.patch(
  '/users/me/notifications/:id/seen',
  isAuthenticated,
  validateId,
  tryCatch(notificationController.markCurrentUserNotificationAsSeen)
);

export default router;
