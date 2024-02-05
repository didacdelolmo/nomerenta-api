import mongoose from 'mongoose';

const {
  MONGODB_TEST_URI,
  MONGODB_URI = 'mongodb://localhost:27017/nomerenta-db',
} = process.env;

mongoose
  .connect(MONGODB_TEST_URI ?? MONGODB_URI)
  .then(async () => {
    console.info(`🍀 [database]: Established database connection`);
  })
  .catch((error) => {
    console.error(`❌ [database]: Connection error:`, error);
  });
