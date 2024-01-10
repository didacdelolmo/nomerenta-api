import PostModel from '../models/post-model'

export async function getById(userId) {
  return PostModel.findById(userId);
} 