import * as postService from '../services/post-service.mjs';

export const updateFeaturedPosts = async (req, res, next) => {
  const now = new Date();
  const posts = await postService.getFeatured();

  for (let post of posts) {
    if (post.featuredUntil < now) {
      post.featuredUntil = null;

      await post.save();
    }
  }

  next();
};
