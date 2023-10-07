import { BunHttpServer } from "~/infra/bun-http-server";

const port = Number(process.env.PORT) || 3000;
const server = new BunHttpServer();

server.listen(port, () => {
  console.log(`Backend is running on port ${port}!`);
});
