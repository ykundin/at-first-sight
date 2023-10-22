import { shouldBeAuth } from "./middlewares/should-be-auth";
import { Matcher } from "~/app/matcher";

import type { HttpRoute } from "./entities/http-route";

export const fireRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/get-fire",
    before: [shouldBeAuth],
    async handler({ user }) {
      const matcher = new Matcher();
      const info = await matcher.getFire(user.username);

      return {
        ok: true,
        data: info,
      };
    },
  },
];
