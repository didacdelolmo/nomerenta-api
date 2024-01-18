import { Schema, Types, model } from 'mongoose';

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
    comments: {
      type: [
        {
          ref: 'Comment',
          type: Types.ObjectId,
        },
      ],
      default: [],
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

PostSchema.pre('save', function (next) {
  this.score = this.upvotes.length - this.downvotes.length;

  next();
});

const PostModel = model('Post', PostSchema);

export default PostModel;
