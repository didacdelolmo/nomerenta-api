import * as commentService from '../services/comment-service.mjs';

export async function comment(req, res) {
  res.send(await commentService.create(req.session.userId, req.body));
}

export async function getUserComments(req, res) {
  res.send(await commentService.getByAuthor(req.params.id));
}

export async function getHierarchicalPostComments(req, res) {
  res.send(await commentService.getHierarchicalPostComments(req.params.id));
}

export async function upvote(req, res) {
  res.send(await commentService.upvote(req.params.id, req.session.userId));
}

export async function downvote(req, res) {
  res.send(await commentService.downvote(req.params.id, req.session.userId));
}

export async function unvote(req, res) {
  res.send(await commentService.unvote(req.params.id, req.session.userId));
}
