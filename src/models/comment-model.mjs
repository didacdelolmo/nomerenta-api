import { Schema, Types, model } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const CommentSchema = new Schema(
  {
    author: {
      ref: 'User',
      type: Types.ObjectId,
      required: true,
      index: true,
      autopopulate: true,
    },
    post: {
      ref: 'Post',
      type: Types.ObjectId,
      required: true,
    },
    parent: {
      ref: 'Comment',
      type: Types.ObjectId,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

CommentSchema.plugin(autopopulate);

const CommentModel = model('Comment', CommentSchema);

export default CommentModel;
