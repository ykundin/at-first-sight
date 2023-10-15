import { DI } from "~/infra/di";

import type { User } from "~/domain/user";
import type { IPInfo, UserVisit } from "~/domain/user-visit";

interface AddVisitParams {
  userName: User["username"];
  ip: IPInfo["ip"];
}

export class Visitor {
  constructor() {}

  get #store() {
    return DI.get().store;
  }

  get #ipInformer() {
    return DI.get().ipInformer;
  }

  get #logger() {
    return DI.get().logger;
  }

  #getVisitByIp(ip: IPInfo["ip"]): Promise<UserVisit | null> {
    return this.#store.visits.findOne({ ip });
  }

  #getVisit(
    username: User["username"],
    ip: IPInfo["ip"]
  ): Promise<UserVisit | null> {
    return this.#store.visits.findOne({ username, ip });
  }

  async #createVisit(
    username: User["username"],
    ipInfo: IPInfo
  ): Promise<boolean> {
    const data = { username, ip: ipInfo.ip, ipInfo };
    const result = await this.#store.visits.insertOne(data);

    return result.acknowledged;
  }

  async addVisit(params: AddVisitParams): Promise<void> {
    const { userName, ip } = params;

    let ipInfo = (await this.#getVisitByIp(ip))?.ipInfo;

    // Get info by IP from external system
    // But info maybe undefined and do not need throw an error
    if (!ipInfo) {
      try {
        ipInfo = await this.#ipInformer.getByIp(ip);
      } catch (err) {
        this.#logger.error(err);
      }
    }

    // Add visit to specified user
    if (ipInfo) {
      const visit = await this.#getVisit(userName, ip);

      if (!visit) {
        this.#createVisit(userName, ipInfo);
      }
    }
  }
}
