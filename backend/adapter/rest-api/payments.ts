import Payments from "~/app/payments";
import Auth from "~/app/auth";

import type { HttpRoute } from "./entities/http-route";

export const paymentsRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/api/unlock-profile",
    async handler({ request }) {
      const payments = new Payments();
      const auth = new Auth();
      const tgUser = auth.getUserByInitData(request.body.initData);

      if (!tgUser) {
        throw new Error("User not found!");
      }

      const link = await payments.unlockProfile({
        currentUserId: tgUser.id,
        requestUserId: request.body.userId,
      });

      return {
        ok: true,
        data: link,
      };
    },
  },
];
