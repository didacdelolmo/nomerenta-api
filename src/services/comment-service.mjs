import CommentModel from '../models/comment-model.mjs';
import * as userService from './user-service.mjs';
import * as postService from './post-service.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';

export async function getById(commentId) {
  return CommentModel.findById(commentId);
}

export async function getByAuthor(authorId) {
  return CommentModel.find({ author: authorId });
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
    throw new IdentifiedError(ErrorCode.INVALID_POST, 'Invalid post');
  }

  await post.populate('comments')
  const comments = post.comments;

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
