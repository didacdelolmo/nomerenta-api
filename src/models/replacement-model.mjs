import { Schema, model } from 'mongoose';

const ReplacementSchema = new Schema({
  replacements: {
    type: [
      {
        _id: false,
        originalText: { type: String, required: true },
        replacement: { type: String, required: true },
      },
    ],
    default: [],
  },
});

const ReplacementModel = model('Replacement', ReplacementSchema);

export default ReplacementModel;
