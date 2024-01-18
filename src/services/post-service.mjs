import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import PostModel from '../models/post-model.mjs';
import * as userService from './user-service.mjs';

export async function getById(postId) {
  return PostModel.findById(postId);
}

export async function getByAuthor(userId) {
  return PostModel.find({ author: userId });
}

export async function getAll({ sortBy = 'score', start = 0, limit = null }) {
  const allowedSortFields = ['score', 'createdAt'];

  if (!allowedSortFields.includes(sortBy) || start < 0) {
    throw new IdentifiedError(
      ErrorCode.INVALID_REQUEST_INPUT,
      'Invalid request input'
    );
  }

  const sort = { [sortBy]: -1 };

  let query = PostModel.find().sort(sort).skip(start);

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const posts = await query.exec();

  return posts;
}

export async function create(userId, { title, content }) {
  const existsUser = await userService.existsId(userId);
  if (!existsUser) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Invalid user');
  }

  const post = await PostModel.create({
    author: userId,
    title,
    content,
  });

  console.log(`🍁 [post-service]: Created post from author ${userId}`, post);

  return post;
}
