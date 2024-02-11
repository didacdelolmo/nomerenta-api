import CommentModel from '../models/comment-model.mjs';
import * as userService from './user-service.mjs';
import * as postService from './post-service.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';
import { Types } from 'mongoose';

export async function getById(commentId) {
  return CommentModel.findById(commentId);
}

export async function getByAuthor(authorId) {
  return CommentModel.find({ author: authorId }).populate('author post');
}

export async function countByPost(postId) {
  return CommentModel.countDocuments({ post: postId });
}

export async function existsId(commentId) {
  return CommentModel.exists({ _id: commentId });
}

export async function create(authorId, { postId, parentId = null, content }) {
  const existsUser = await userService.existsId(authorId);
  if (!existsUser) {
    throw new IdentifiedError(ErrorCode.INVALID_USER, 'Invalid user');
  }

  const existsPost = await postService.existsId(postId);
  if (!existsPost) {
    throw new IdentifiedError(ErrorCode.INVALID_POST, 'Invalid post');
  }

  if (parentId) {
    const existsParent = await existsId(parentId);
    if (!existsParent) {
      throw new IdentifiedError(
        ErrorCode.INVALID_COMMENT_PARENT,
        'Invalid comment parent'
      );
    }
  }

  const comment = await CommentModel.create({
    author: authorId,
    post: postId,
    parent: parentId,
    content,
  });

  console.log(
    `💭 [comment-service]: Created comment from author ${authorId} on post ${postId}`,
    comment
  );

  return comment;
}

export async function getHierarchicalPostComments(postId) {
  const post = await postService.getById(postId);
  if (!post) {
    throw new IdentifiedError(ErrorCode.INVALID_POST, 'Publicación inválida');
  }

  await post.populate('comments');
  const comments = post.comments.reverse();

  const commentMap = new Map();
  const hierarchicalComments = [];

  for (const comment of comments) {
    commentMap.set(comment._id.toString(), {
      ...comment.toObject(),
      replies: [],
    });
  }

  for (const comment of comments) {
    const parentComment = commentMap.get(
      comment.parent && comment.parent.toString()
    );

    if (parentComment) {
      parentComment.replies.push(commentMap.get(comment._id.toString()));
    } else {
      hierarchicalComments.push(commentMap.get(comment._id.toString()));
    }
  }

  return hierarchicalComments;
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
