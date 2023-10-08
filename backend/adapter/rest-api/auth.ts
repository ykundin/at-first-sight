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
];
