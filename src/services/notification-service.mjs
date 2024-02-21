import * as userService from './user-service.mjs';
import * as postService from './post-service.mjs';
import * as commentService from './comment-service.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';
import NotificationModel from '../models/notification-model.mjs';

export async function getByTarget(targetId) {
  return NotificationModel.find({ target: targetId }).sort({ createdAt: -1 }).populate('sender post');
}

export async function getUnseenCountByTarget(targetId) {
  return NotificationModel.countDocuments({ target: targetId, seen: false });
}

/**
 * senderId, postId and commentId are optional
 */
export async function create({
  senderId,
  targetId,
  postId,
  commentId,
  message,
}) {
  if (senderId) {
    const existsSender = await userService.existsId(senderId);
    if (!existsSender) {
      throw new IdentifiedError(
        ErrorCode.INVALID_USER,
        'Este usuario no existe'
      );
    }
  }

  const target = await userService.getById(targetId);
  if (!target) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe');
  }

  if (postId) {
    const existsPost = await postService.existsId(postId);
    if (!existsPost) {
      throw new IdentifiedError(
        ErrorCode.INVALID_POST,
        'Esta publicación no existe'
      );
    }
  }

  if (commentId) {
    const existsComment = await commentService.existsId(commentId);
    if (!existsComment) {
      throw new IdentifiedError(
        ErrorCode.INVALID_COMMENT,
        'Este comentario no existe'
      );
    }
  }

  const notification = await NotificationModel.create({
    sender: senderId,
    target: targetId,
    post: postId,
    comment: commentId,
    message,
  });

  console.log(
    `🔔 [notification-service] Created a notification for target ${target.username} with message ${message}`
  );

  return notification;
}

export async function markEverythingAsSeen(targetId) {
  await NotificationModel.updateMany(
    { target: targetId, seen: false },
    { $set: { seen: true } }
  );
}
