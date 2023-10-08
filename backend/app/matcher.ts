import Auth from "~/app/auth";

import type { User } from "~/domain/user";

const allPeoples = [
  {
    id: 1,
    firstName: "Olga",
    age: 26,
    description: "Project manager at IT company",
    image:
      "https://i.pinimg.com/736x/07/e1/2c/07e12ce93307d98b5bb175b77f42db16.jpg",
    link: "https://t.me/ykundin",
  },
  {
    id: 2,
    firstName: "Alena",
    age: 27,
    description: "I love dogs and you!",
    image:
      "https://yobte.ru/uploads/posts/2019-11/devushki-s-sobakami-123-foto-90.jpg",
    link: "https://t.me/ykundin",
  },
];

export class Matcher {
  #auth: Auth;

  constructor() {
    this.#auth = new Auth();
  }

  #getRandomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

  async getRecommendations(userId: User["id"]) {
    const user = await this.#auth.getUserById(userId);
    const peoples = allPeoples.slice(0, 2);

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
    const randomIndex = this.#getRandomInt(0, allPeoples.length - 1);
    const newPeople = allPeoples[randomIndex];

    console.log("randomIndex", randomIndex);

    return {
      locked: user ? user.restScores < 1 : true,
      newPeople: newPeople,
    };
  }
}
