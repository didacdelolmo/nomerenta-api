import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    hashedPassword: { type: String, required: true, select: false },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
});
UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
});

UserSchema.methods.withoutHashedPassword = function () {
  const object = this.toObject();
  delete object.hashedPassword;
  return object;
};

const UserModel = model('User', UserSchema);

export default UserModel;
