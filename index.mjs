import 'dotenv/config';
import app from './src/app.mjs';

const { SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`⚡ [server]: Server is running at port ${SERVER_PORT}`);
});
