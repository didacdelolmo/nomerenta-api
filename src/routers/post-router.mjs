import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import {
  validateCreatePostInput,
  validateFeaturePostInput,
  validateGetAllPostsInput,
} from '../validation/post-validation.mjs';
import { tryCatch } from '../utils/try-catch.mjs';
import * as postController from '../controllers/post-controller.mjs';
import { validateId } from '../validation/params-validation.mjs';
import { updateFeaturedPosts } from '../middleware/update-featured-posts.mjs';

const router = express.Router();

router.get(
  '/posts',
  validateGetAllPostsInput,
  // updateFeaturedPosts,
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

router.patch(
  '/posts/:id/upvote',
  isAuthenticated,
  validateId,
  tryCatch(postController.upvote)
);

router.patch(
  '/posts/:id/downvote',
  isAuthenticated,
  validateId,
  tryCatch(postController.downvote)
);

router.patch(
  '/posts/:id/unvote',
  isAuthenticated,
  validateId,
  tryCatch(postController.unvote)
);

router.patch(
  '/posts/:id/feature',
  isAuthenticated,
  validateId,
  tryCatch(postController.feature)
);

export default router;
