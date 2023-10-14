import { ExpressHttpServer } from "~/infra/express-http-server";
import { DI } from "~/infra/di";
import { MongoStore } from "~/infra/mongo-store";

DI.setMany({
  store: new MongoStore(),
});

const port = Number(process.env.PORT) || 3000;
const server = new ExpressHttpServer();

server.listen(port, () => {
  console.log(`Backend is running on port ${port}!`);
});
