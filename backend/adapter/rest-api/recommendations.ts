import { shouldBeAuth } from "./middlewares/should-be-auth";

import type { HttpRoute } from "./entities/http-route";

const peoples = [
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

export const recommendationsRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/get-recommendations",
    before: [shouldBeAuth],
    async handler() {
      return {
        ok: true,
        data: {
          locked: false,
          peoples,
        },
      };
    },
  },

  {
    method: "POST",
    path: "/api/send-reaction",
    before: [shouldBeAuth],
    async handler() {
      return {
        ok: true,
        data: {
          locked: false,
          newPeople: peoples[1],
        },
      };
    },
  },
];
