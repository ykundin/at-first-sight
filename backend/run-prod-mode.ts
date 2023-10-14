import { ExpressHttpServer } from "~/infra/express-http-server";
import { DI } from "~/infra/di";
import { MongoStore } from "~/infra/mongo-store";
import { TgBotApi } from "./infra/tg-bot-api";
import { SentryLogger } from "./infra/loggers/sentry-logger";

async function runProdMode() {
  DI.setMany({
    store: new MongoStore(),
    botApi: new TgBotApi(),
    logger: new SentryLogger(),
  });

  const port = Number(process.env.PORT) || 3000;
  const server = new ExpressHttpServer();

  await DI.get().botApi.setWebhook();

  server.listen(port, () => {
    console.log(`Backend is running on port ${port}!`);
  });
}

runProdMode();
