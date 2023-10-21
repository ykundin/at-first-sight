import { Gauge, Registry } from "prom-client";

import { Auth } from "~/app/auth";
import { DI } from "~/infra/di";

export class Stats {
  #auth: Auth;
  #registry: Registry;

  #usersGauge: Gauge;
  #menGauge: Gauge;
  #womenGauge: Gauge;

  constructor() {
    this.#auth = new Auth();
    this.#registry = new Registry();

    // All users
    this.#usersGauge = new Gauge({
      name: "users_total",
      help: "Count of all users",
    });

    // Only men
    this.#menGauge = new Gauge({
      name: "users_men_total",
      help: "Count of all men",
    });

    // Only women
    this.#womenGauge = new Gauge({
      name: "users_women_total",
      help: "Count of all women",
    });

    this.#registry.registerMetric(this.#usersGauge);
    this.#registry.registerMetric(this.#menGauge);
    this.#registry.registerMetric(this.#womenGauge);
  }

  get #store() {
    return DI.get().store;
  }

  async #getCountOfUsers() {
    const users = await this.#store.users.find().toArray();
    const men = users.filter((user) => user.gender === "man");
    const women = users.filter((user) => user.gender === "woman");

    return {
      all: users.length,
      men: men.length,
      women: women.length,
    };
  }

  async getMetrics() {
    const countOfUsers = await this.#getCountOfUsers();

    this.#usersGauge.set(countOfUsers.all);
    this.#menGauge.set(countOfUsers.men);
    this.#womenGauge.set(countOfUsers.women);

    return this.#registry.metrics();
  }
}
