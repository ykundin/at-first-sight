import Auth from "~/app/auth";
import { shouldBeAuth } from "./middlewares/should-be-auth";

import type { HttpRoute } from "./entities/http-route";

export const authRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/api/get-user",
    async handler({ request, response, user: authUser }) {
      // User already authorized
      if (authUser) {
        return {
          ok: true,
          data: authUser,
        };
      }

      const auth = new Auth();
      const tgUser = auth.getUserByInitData(request.body.initData);
      const user = await auth.getUserById(tgUser.id);

      if (user) {
        const sessionId = await auth.createSession(user.id);

        // Save the sessionId in cookie
        if (sessionId) {
          response.setCookie(auth.cookieName, sessionId, {
            secure: true,
            httpOnly: true,
          });
        }
      }

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

      if (user) {
        const sessionId = await auth.createSession(user.id);

        // Save the sessionId in cookie
        if (sessionId) {
          response.setCookie(auth.cookieName, sessionId, {
            secure: true,
            httpOnly: true,
          });
        }
      }

      return {
        ok: true,
        data: user,
      };
    },
  },

  {
    method: "POST",
    path: "/api/edit-profile",
    before: [shouldBeAuth],
    async handler({ request, user }) {
      const auth = new Auth();
      const status = await auth.editUser(user.id, request.body);

      return {
        ok: status,
      };
    },
  },
];
