import { Types } from 'mongoose';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import PostModel from '../models/post-model.mjs';
import * as userService from './user-service.mjs';
import UserModel from '../models/user-model.mjs';

export async function getById(postId) {
  return PostModel.findById(postId).populate('author');
}

export async function getByAuthor(userId) {
  return PostModel.find({ author: userId }).populate('author');
}

export async function getFeatured() {
  return PostModel.find({ featuredUntil: { $ne: null } });
}

export async function getByFollows(userId) {
  const user = await UserModel.findById(userId).select('following');
  if (!user) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe');
  }

  return PostModel.find({ author: { $in: user.following } }).sort({
    createdAt: -1,
  });
}

export async function getAll({ sortBy = 'score', start = 0, limit = null }) {
  const allowedSortFields = ['score', 'createdAt'];

  if (!allowedSortFields.includes(sortBy) || start < 0) {
    throw new IdentifiedError(
      ErrorCode.INVALID_REQUEST_INPUT,
      'Solicitud inválida'
    );
  }

  const sort = { [sortBy]: -1 };

  let query = PostModel.find().sort(sort).skip(start);

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const posts = await query.populate('author').exec();

  return posts;
}

export async function existsId(postId) {
  return PostModel.exists({ _id: postId });
}

export async function create(userId, { title, content }) {
  const existsUser = await userService.existsId(userId);
  if (!existsUser) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe');
  }

  const post = await PostModel.create({
    author: userId,
    title,
    content,
  });

  console.log(`🍁 [post-service]: Created post from author ${userId}`, post);

  return post;
}

export async function upvote(postId, userId) {
  return rate(postId, userId, 'positive');
}

export async function downvote(postId, userId) {
  return rate(postId, userId, 'negative');
}

export async function unvote(postId, userId) {
  return rate(postId, userId, 'undo');
}

/**
 * * type can be either 'positive', 'negative' or 'undo'
 */
async function rate(postId, userId, type = 'positive') {
  const post = await getById(postId);
  if (!post) {
    throw new IdentifiedError(ErrorCode.INVALID_POST, 'Publicación inválida');
  }

  const existsUser = await userService.existsId(userId);
  if (!existsUser) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe');
  }

  const upvotesSet = new Set(post.upvotes.map((id) => id.toString()));
  const downvotesSet = new Set(post.downvotes.map((id) => id.toString()));

  switch (type) {
    case 'positive':
      if (downvotesSet.has(userId)) {
        downvotesSet.delete(userId);
      }
      upvotesSet.add(userId);
      break;
    case 'negative':
      if (upvotesSet.has(userId)) {
        upvotesSet.delete(userId);
      }
      downvotesSet.add(userId);
      break;
    case 'undo':
      upvotesSet.delete(userId);
      downvotesSet.delete(userId);
      break;
    default:
      throw new IdentifiedError(ErrorCode.INVALID_RATE, 'Rating inválido');
  }

  post.upvotes = Array.from(upvotesSet).map((id) => new Types.ObjectId(id));
  post.downvotes = Array.from(downvotesSet).map((id) => new Types.ObjectId(id));

  await post.save();

  return post;
}

export async function incrementCommentsCount(postId) {
  await PostModel.updateOne(
    { _id: postId },
    { $inc: { commentsCount: 1 } }
  ).exec();
}

export async function decrementCommentsCount(postId) {
  await PostModel.updateOne(
    { _id: postId },
    { $inc: { commentsCount: -1 } }
  ).exec();
}

export async function feature(userId, postId) {
  const user = await UserModel.findById(userId).select('+actions');
  if (!user) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Usuario inválido');
  }

  const post = await getById(postId);
  if (!post) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Publicación inválida');
  }

  const role = user.role;
  if (!role.canFeaturePosts) {
    throw new IdentifiedError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'No tienes permisos para realizar esta acción'
    );
  }

  if (!userService.canPerformAction(user, 'featured')) {
    throw new IdentifiedError(
      ErrorCode.REACHED_ACTION_LIMIT,
      'Has llegado al limite de veces que puedes realizar esta acción diariamente'
    );
  }

  const date = new Date();
  date.setHours(date.getHours() + 8);

  post.featuredUntil = date;
  user.actions.featured.push({ date: new Date(), post: post._id });

  await user.save();
  await post.save();

  console.log(
    `🌿 [post-service]: Professor ${user.username} featured the post with id ${post._id}`,
    post
  );

  return post;
}
