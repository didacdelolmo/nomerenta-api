import { Schema, model } from 'mongoose';

const CounterSchema = new Schema({
  count: { type: Number, default: 0 },
});

const CounterModel = model('Counter', CounterSchema);

export default CounterModel;
