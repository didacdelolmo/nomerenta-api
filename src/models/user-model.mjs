import { Schema, model } from 'mongoose';
import RoleIdentifier from '../roles/role-identifier.mjs';
import RoleManager from '../roles/role-manager.mjs';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    hashedPassword: { type: String, required: true, select: false },
    avatar: { type: String, default: null },
    roleId: { type: String, default: RoleIdentifier.MEMBER },
    anonymous: { type: Boolean, default: false },
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

UserSchema.virtual('role').get(function () {
  return RoleManager.getRole(this.roleId);
});

UserSchema.methods.withoutHashedPassword = function () {
  const object = this.toObject();
  delete object.hashedPassword;
  return object;
};

const UserModel = model('User', UserSchema);

export default UserModel;
