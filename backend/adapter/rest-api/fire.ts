import { shouldBeAuth } from "./middlewares/should-be-auth";

import type { HttpRoute } from "./entities/http-route";

export const fireRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/get-fire",
    before: [shouldBeAuth],
    async handler() {
      return {
        ok: true,
        data: [
          {
            id: 1,
            firstName: "Olga",
            age: 26,
            description: "Project manager at IT company",
            view: "opened",
            image:
              "https://get.wallhere.com/photo/women-face-portrait-depth-of-field-1393595.jpg",
            link: "https://t.me/ykundin",
          },
          {
            id: 2,
            firstName: "Alena",
            age: 27,
            description: "I love dogs and you!",
            view: "opened",
            image:
              "https://yobte.ru/uploads/posts/2019-11/devushki-s-sobakami-123-foto-90.jpg",
            link: "https://t.me/ykundin",
          },
          {
            id: 3,
            firstName: "Victoria",
            age: 23,
            description: "I keep my secrets carefully",
            view: "locked",
            image: "https://beautifoto.ru/wp-content/uploads/2020/02/3-1.jpg",
            link: "https://t.me/ykundin",
          },
        ],
      };
    },
  },
];
