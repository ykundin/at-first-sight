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
        currentUsername: user.username,
        requestUsername: request.body.username,
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
        currentUsername: user.username,
      });

      return {
        ok: true,
        data: link,
      };
    },
  },
];
