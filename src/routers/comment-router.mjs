import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { validateId } from '../validation/params-validation.mjs';
import { validateCreateCommentInput } from '../validation/comment-validation.mjs';
import * as commentController from '../controllers/comment-controller.mjs';
import { tryCatch } from '../utils/try-catch.mjs';

const router = express.Router();

router.get(
  '/users/:id/comments',
  validateId,
  tryCatch(commentController.getUserComments)
);

router.get(
  '/posts/:id/comments',
  validateId,
  tryCatch(commentController.getHierarchicalPostComments)
);

router.post(
  '/posts/:id/comments',
  isAuthenticated,
  validateId,
  validateCreateCommentInput,
  tryCatch(commentController.comment)
);

router.patch(
  '/comments/:id/upvote',
  isAuthenticated,
  validateId,
  tryCatch(commentController.upvote)
);

router.patch(
  '/comments/:id/downvote',
  isAuthenticated,
  validateId,
  tryCatch(commentController.downvote)
);

router.patch(
  '/comments/:id/unvote',
  isAuthenticated,
  validateId,
  tryCatch(commentController.unvote)
);

export default router;
