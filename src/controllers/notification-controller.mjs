import * as notificationService from '../services/notification-service.mjs';

export async function getCurrentUserNotifications(req, res) {
  res.send(await notificationService.getByTarget(req.session.userId));
}

export async function getCurrentUserNotificationCount(req, res) {
  res.json(
    await notificationService.getUnseenCountByTarget(req.session.userId)
  );
}

export async function markCurrentUserNotificationsAsSeen(req, res) {
  await notificationService.markEverythingAsSeen(req.session.userId);

  res.send(200);
}
