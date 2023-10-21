import type { MongoStore } from "~/infra/mongo-store";
import type { TgBotApi } from "./tg-bot-api";
import type { Logger } from "./entities/logger";
import type { IPInformer } from "./entities/ip-informer";
import type { Stats } from "~/app/stats";

export interface DIDeps {
  store: MongoStore;
  botApi: TgBotApi;
  logger: Logger;
  ipInformer: IPInformer;
  stats: Stats;
}

interface DIStore {
  current: DIDeps;
}

export interface DIManager {
  get(): DIDeps;
  setMany(deps: DIDeps): void;
}

const store: DIStore = {
  current: {} as any,
};

export const DI: DIManager = {
  get() {
    return store.current;
  },

  setMany(deps) {
    store.current = deps;
  },
};
