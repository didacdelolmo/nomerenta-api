import * as postService from '../services/post-service.mjs';

export async function getAllPosts(req, res) {
  res.send(await postService.getAll(req.query));
}

export async function getPost(req, res) {
  res.send(await postService.getById(req.params.id));
}

export async function getUserPost(req, res) {
  res.send(await postService.getByAuthor(req.params.id));
}

export async function getCurrentUserPosts(req, res) {
  res.send(await postService.getByAuthor(req.session.userId));
}

export async function post(req, res) {
  res.send(await postService.create(req.session.userId, req.body));
}

export async function upvote(req, res) {
  res.send(await postService.upvote(req.params.id, req.session.userId));
}

export async function downvote(req, res) {
  res.send(await postService.downvote(req.params.id, req.session.userId));
}

export async function unvote(req, res) {
  res.send(await postService.unvote(req.params.id, req.session.userId));
}

export async function feature(req, res) {
  res.send(await postService.feature(req.session.userId, req.params.id));
}
