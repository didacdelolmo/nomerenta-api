import { Schema, Types, model } from 'mongoose';

const CommentSchema = new Schema({
  author: {
    ref: 'User',
    type: Types.ObjectId,
    required: true,
    index: true,
  },
  replies: {
    type: [
      {
        ref: 'Comment',
        type: Types.ObjectId,
      },
    ],
    default: [],
  },
}, { timestamps: true });

const CommentModel = model('Comment', CommentSchema);

export default CommentModel;
