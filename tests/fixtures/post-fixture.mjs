import PostModel from '../../src/models/post-model.mjs';
import * as postService from '../../src/services/post-service.mjs';

class PostFixture {
  _id;
  authorId;
  title;
  content;

  constructor(authorId, title, content) {
    this.authorId = authorId;
    this.title = title;
    this.content = content;
  }

  static async create(authorId, title, content) {
    const post = new this(authorId, title, content);
    await post.insert();
    return post;
  }

  static async clean() {
    return PostModel.deleteMany({});
  }

  async get() {
    return postService.getById(this._id);
  }

  async insert() {
    const post = await postService.create(this.authorId, { title: this.title, content: this.content });
    this._id = post._id.toString();

  }
}

export default PostFixture;
