import { Schema, Types, model } from 'mongoose';
import constants from '../config/constants.mjs';

const VisitSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, default: Date.now },
  lastActionDate: { type: Date, default: Date.now },
  inactivityFactor: {
    type: Number,
    default: constants.VISIT_INACTIVITY_MINUTES_FACTOR,
  },
});

const VisitModel = model('Visit', VisitSchema);

export default VisitModel;
