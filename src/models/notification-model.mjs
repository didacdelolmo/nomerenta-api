import { Schema, Types, model } from 'mongoose';

const NotificationSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: 'User', default: null },
    target: { type: Types.ObjectId, ref: 'User', default: null, index: true },
    post: { type: Types.ObjectId, ref: 'Post', default: null },
    comment: { type: Types.ObjectId, ref: 'Comment', default: null },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const NotificationModel = model('Notification', NotificationSchema);

export default NotificationModel;
