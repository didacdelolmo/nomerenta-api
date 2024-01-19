import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { validateId } from '../validation/params-validation.mjs';
import { validateCreateCommentInput } from '../validation/comment-validation.mjs';
import * as commentController from '../controllers/comment-controller.mjs';
import { tryCatch } from '../utils/try-catch.mjs';

const router = express.Router();

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

export default router;
