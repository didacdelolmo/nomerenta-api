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
  },
  { timestamps: true }
);

CommentSchema.pre('save', function (next) {
  this.score = this.upvotes.length - this.downvotes.length;

  next();
});

CommentSchema.plugin(autopopulate);

const CommentModel = model('Comment', CommentSchema);

export default CommentModel;
