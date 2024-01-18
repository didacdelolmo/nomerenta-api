import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import {
  validateCreatePostInput,
  validateGetAllPostsInput,
} from '../validation/post-validation.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as postController from '../controllers/post-controller.mjs';
import { validateId } from '../validation/comment-validation.mjs';

const router = express.Router();

router.get(
  '/posts',
  validateGetAllPostsInput,
  tryCatch(postController.getAllPosts)
);

router.get('/posts/:id', validateId, tryCatch(postController.getPost));

/** This must be above /users/:id/posts to avoid conflict */
router.get(
  '/users/me/posts',
  isAuthenticated,
  tryCatch(postController.getCurrentUserPosts)
);

router.get(
  '/users/:id/posts',
  validateId,
  tryCatch(postController.getUserPost)
);

router.post(
  '/users/me/posts',
  isAuthenticated,
  validateCreatePostInput,
  tryCatch(postController.post)
);

export default router;
