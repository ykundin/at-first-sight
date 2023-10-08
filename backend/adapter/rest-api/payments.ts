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
];
