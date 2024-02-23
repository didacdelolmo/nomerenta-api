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
    commentsCount: { type: Number, default: 0 },
    format: { type: Boolean, default: false },
    featuredUntil: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
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

  next();
});

const PostModel = model('Post', PostSchema);

export default PostModel;
