import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  hashedPassword: { type: String, required: true, select: false },
  avatar: { type: String, default: null }, // what will the default img be
});

const UserModel = model('User', UserSchema);

export default UserModel;
