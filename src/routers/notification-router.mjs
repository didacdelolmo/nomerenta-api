import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as notificationController from '../controllers/notification-controller.mjs';

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

export default router;
