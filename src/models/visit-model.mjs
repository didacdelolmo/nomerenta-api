import { Schema, Types, model } from 'mongoose';
import constants from '../config/constants.mjs';

const VisitSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, default: Date.now },
  lastActionDate: { type: Date, default: Date.now },
  durationFactor: {
    type: Number,
    default: constants.VISIT_DURATION_MINUTES_FACTOR,
  },
});

const VisitModel = model('Visit', VisitSchema);

export default VisitModel;
