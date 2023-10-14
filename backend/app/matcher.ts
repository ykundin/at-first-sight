import { Auth } from "~/app/auth";
import { DI } from "~/infra/di";

import type { User } from "~/domain/user";

export class Matcher {
  #auth: Auth;

  constructor() {
    this.#auth = new Auth();
  }

  get #users() {
    return DI.get().store.users;
  }

  #getRandomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

  #findPeoples(user: User | null, limit: number) {
    return this.#users
      .find({ gender: user?.interestsGender })
      .limit(limit)
      .toArray();
  }

  async getRecommendations(userId: User["id"]) {
    const user = await this.#auth.getUserById(userId);
    const peoples = await this.#findPeoples(user, 2);

    return {
      locked: user ? user.restScores < 1 : true,
      peoples,
    };
  }

  async sendReaction(params: {
    userId: User["id"];
    targetUserId: User["id"];
    reaction: "no" | "yes";
  }) {
    const { userId, targetUserId } = params;
    const decreased = await this.#auth.decreaseScores(userId);

    if (!decreased) throw new Error("Fail to decrease scores!");

    const user = await this.#auth.getUserById(userId);
    const allPeoples = await this.#findPeoples(user, 10);
    const randomIndex = this.#getRandomInt(0, allPeoples.length - 1);
    const newPeople = allPeoples[randomIndex];

    return {
      locked: user ? user.restScores < 1 : true,
      newPeople: newPeople,
    };
  }

  async getFire(userId: User["id"]) {
    const user = await this.#auth.getUserById(userId);
    const peoples = await this.#findPeoples(user, 3);
    const opened = [peoples[0], peoples[1]];
    const locked = [peoples[2]];

    return {
      opened,
      locked,
    };
  }
}
