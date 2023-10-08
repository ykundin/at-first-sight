import { shouldBeAuth } from "./middlewares/should-be-auth";
import Payments from "~/app/payments";

import type { HttpRoute } from "./entities/http-route";

export const paymentsRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/api/unlock-profile",
    before: [shouldBeAuth],
    async handler({ request, user }) {
      const payments = new Payments();

      const link = await payments.unlockProfile({
        currentUserId: user.id,
        requestUserId: request.body.userId,
      });

      return {
        ok: true,
        data: link,
      };
    },
  },

  {
    method: "POST",
    path: "/api/buy-scores",
    before: [shouldBeAuth],
    async handler({ request, user }) {
      const payments = new Payments();

      const link = await payments.buyScores({
        currentUserId: user.id,
      });

      return {
        ok: true,
        data: link,
      };
    },
  },
];
