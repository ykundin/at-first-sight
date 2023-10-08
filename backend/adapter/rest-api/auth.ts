import Auth from "~/app/auth";

import type { HttpRoute } from "./entities/http-route";

export const authRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/api/get-user",
    async handler({ user }) {
      return {
        ok: true,
        data: user,
      };
    },
  },

  {
    method: "POST",
    path: "/api/registration",
    async handler({ request, response }) {
      const auth = new Auth();
      const tgUser = auth.getUserByInitData(request.body.get("initData"));
      const user = await auth.register(request.body, tgUser);
      const sessionId = await auth.createSession(user.id);

      // Save the sessionId in cookie
      if (sessionId) {
        response.setCookie(auth.cookieName, sessionId, {
          secure: true,
          httpOnly: true,
        });
      }

      return {
        ok: true,
        data: user,
      };
    },
  },
];
