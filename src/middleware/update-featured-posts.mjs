export const updateFeaturedPosts = async (req, res, next) => {
  const now = new Date();
  await PostModel.updateMany(
    { featuredUntil: { $lt: now } },
    { $set: { featuredUntil: null } }
  );
  next();
};
