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
      const info = await matcher.getRecommendations(user.id);

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
      const targetUserId = request.body.targetUserId;
      const reaction = request.body.reaction;
      const info = await matcher.sendReaction({
        userId: user.id,
        targetUserId,
        reaction,
      });

      return {
        ok: true,
        data: info,
      };
    },
  },
];
