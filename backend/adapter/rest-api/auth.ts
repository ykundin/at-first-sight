import Auth from "~/app/auth";

import type { HttpRoute } from "./entities/http-route";

export const authRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/api/get-user",
    async handler({ request }) {
      const auth = new Auth();
      const user = auth.getUserByInitData(request.body.initData);

      return {
        ok: true,
        data: user,
      };
    },
  },

  {
    method: "POST",
    path: "/api/registration",
    async handler({ request }) {
      const auth = new Auth();
      const tgUser = auth.getUserByInitData(request.body.get("initData"));
      const user = await auth.register(request.body, tgUser);

      return {
        ok: true,
        data: user,
      };
    },
  },
];
