import { BunHttpServer } from "~/infra/bun-http-server";

const port = Number(process.env.PORT) || 3001;
const server = new BunHttpServer();

server.listen(port, () => {
  console.log(`Application is running on port ${port}!`);
});
