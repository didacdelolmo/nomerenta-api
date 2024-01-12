import PostModel from '../models/post-model.mjs'

export async function getById(userId) {
  return PostModel.findById(userId);
}