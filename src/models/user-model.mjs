import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  hashedPassword: { type: String, required: true, select: false },
  avatar: { type: String, default: null }, // what will the default img be
});

UserSchema.methods.withoutHashedPassword = function () {
  const object = this.toObject();
  delete object.hashedPassword;
  return object;
}

const UserModel = model('User', UserSchema);

export default UserModel;
