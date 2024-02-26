import * as notificationService from '../services/notification-service.mjs';

export async function getCurrentUserNotifications(req, res) {
  res.send(await notificationService.getByTarget(req.session.userId));
}

export async function getCurrentUserUnseenNotificationsCount(req, res) {
  res.json(
    await notificationService.getUnseenCountByTarget(req.session.userId)
  );
}

export async function markCurrentUserNotificationAsSeen(req, res) {
  await notificationService.markAsSeen(req.session.userId, req.params.id)
}

export async function markCurrentUserNotificationsAsSeen(req, res) {
  await notificationService.markEverythingAsSeen(req.session.userId);

  res.send(200);
}
