import CounterModel from '../models/counter-model.mjs';

export const initializeCounter = async () => {
  const existsCounter = await CounterModel.findOne();
  if (!existsCounter) {
    await CounterModel.create({});

    console.log('⌚ [counter] Created the initial counter document');
  }
};
