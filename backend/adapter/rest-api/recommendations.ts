import { shouldBeAuth } from "./middlewares/should-be-auth";
import { Matcher } from "~/app/matcher";

import type { HttpRoute } from "./entities/http-route";

export const recommendationsRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/get-recommendations",
    before: [shouldBeAuth],
    async handler({ user }) {
      const matcher = new Matcher();
      const info = await matcher.getRecommendations(user.username);

      return {
        ok: true,
        data: info,
      };
    },
  },

  {
    method: "POST",
    path: "/api/send-reaction",
    async handler({ user, request }) {
      const matcher = new Matcher();
      const targetUsername = request.body.targetUsername;
      const reaction = request.body.reaction;
      const info = await matcher.sendReaction({
        username: user.username,
        targetUsername: targetUsername,
        reaction,
      });

      return {
        ok: true,
        data: info,
      };
    },
  },
];
