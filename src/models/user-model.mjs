import { Schema, Types, model } from 'mongoose';
import RoleIdentifier from '../roles/role-identifier.mjs';
import RoleManager from '../roles/role-manager.mjs';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    hashedPassword: { type: String, required: true, select: false },
    avatar: { type: String, default: null },
    roleId: { type: String, default: RoleIdentifier.MEMBER },
    biography: { type: String, default: null },
    flair: { type: String, default: null },
    anonymous: { type: Boolean, default: false },
    actions: {
      biography: {
        type: [
          {
            _id: false,
            date: { type: Date, required: true },
            target: { type: Types.ObjectId, ref: 'User', required: true },
          },
        ],
        default: [],
      },
      flair: {
        type: [
          {
            _id: false,
            date: { type: Date, required: true },
            target: { type: Types.ObjectId, ref: 'User', required: true },
          },
        ],
        default: [],
      },
      featured: {
        type: [
          {
            _id: false,
            date: { type: Date, required: true },
            post: { type: Types.ObjectId, ref: 'Post', required: true },
          },
        ],
        default: [],
      },
    },
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
