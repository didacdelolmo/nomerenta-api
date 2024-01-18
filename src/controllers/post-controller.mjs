import * as postService from '../services/post-service.mjs';

export async function getAllPosts(req, res) {
  res.send(await postService.getAll(req.params));
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
