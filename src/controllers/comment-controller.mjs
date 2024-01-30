import * as commentService from '../services/comment-service.mjs';

export async function comment(req, res) {
  res.send(await commentService.create(req.session.userId, req.body));
}

export async function getHierarchicalPostComments(req, res) {
  res.send(await commentService.getHierarchicalPostComments(req.params.id));
}
