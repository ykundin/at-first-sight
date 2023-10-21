import { ExpressHttpServer } from "~/infra/express-http-server";
import { DI } from "~/infra/di";
import { MongoStore } from "~/infra/mongo-store";
import { TgBotApi } from "~/infra/tg-bot-api";
import { IPRegistryInformer } from "~/infra/ip-registry-informer";
import { Stats } from "~/app/stats";

async function runDevMode() {
  DI.setMany({
    store: new MongoStore(),
    botApi: new TgBotApi(),
    ipInformer: new IPRegistryInformer(),
    stats: new Stats(),
    logger: console,
  });

  const port = Number(process.env.PORT) || 3000;
  const server = new ExpressHttpServer();

  await DI.get().botApi.setWebhook();

  server.listen(port, () => {
    console.log(`Backend is running on port ${port}!`);
  });
}

runDevMode();
