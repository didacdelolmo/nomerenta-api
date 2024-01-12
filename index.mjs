import app from "./src/app.mjs";

const { SERVER_PORT = 3000 } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`⚡ [server]: Server is running at port ${3000}`);
});
