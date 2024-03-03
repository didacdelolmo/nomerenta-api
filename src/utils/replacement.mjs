import ReplacementModel from '../models/replacement-model.mjs';

export const initializeReplacement = async () => {
  const existsReplacement = await ReplacementModel.findOne();
  if (!existsReplacement) {
    await ReplacementModel.create({});

    console.log('📝 [replacement]: Created the initial replacement document');
  }
};
