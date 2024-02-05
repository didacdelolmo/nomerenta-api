import { Schema, Types, model } from 'mongoose';
import * as commentService from '../services/comment-service.mjs';

const PostSchema = new Schema(
  {
    author: {
      ref: 'User',
      type: Types.ObjectId,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    upvotes: {
      type: [
        {
          ref: 'User',
          type: Types.ObjectId,
        },
      ],
      default: [],
    },
    downvotes: {
      type: [
        {
          ref: 'User',
          type: Types.ObjectId,
        },
      ],
      default: [],
    },
    score: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
  options: { sort: { createdAt: 1 } },
});

PostSchema.pre('save', function (next) {
  this.score = this.upvotes.length - this.downvotes.length;
  this.commentCount = commentService.countByPost(this._id);

  next();
});

const PostModel = model('Post', PostSchema);

export default PostModel;
