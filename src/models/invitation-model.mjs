import { Schema, Types, model } from 'mongoose';

const InvitationSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User', default: null },
    targets: { type: [{ type: Types.ObjectId, ref: 'User' }], default: [] },
    code: { type: String, required: true, unique: true, index: true },
    expirationDate: { type: Date, default: null },
    reusable: { type: Boolean, default: false },
    redeemed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const InvitationModel = model('Invitation', InvitationSchema);

export default InvitationModel;
