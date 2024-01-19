import CommentModel from '../../src/models/comment-model.mjs';
import * as commentService from '../../src/services/comment-service.mjs';

class CommentFixture {
  _id;
  authorId;
  postId;
  parentId;
  content;

  constructor(authorId, postId, parentId, content) {
    this.authorId = authorId;
    this.postId = postId;
    this.parentId = parentId;
    this.content = content;
  }

  static async create(authorId, postId, parentId, content) {
    const comment = new this(authorId, postId, parentId, content);
    await comment.insert();
    return comment;
  }

  static async clean() {
    return CommentModel.deleteMany({});
  }

  async get() {
    return commentService.getById(this._id);
  }

  async insert() {
    const comment = await commentService.create(this.authorId, {
      postId: this.postId,
      parentId: this.parentId,
      content: this.content,
    });
    this._id = comment._id.toString();
  }
}

export default CommentFixture;
