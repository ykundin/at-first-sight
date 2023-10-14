import multiparty from "multiparty";

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
    async handler({ req, request, response }) {
      const auth = new Auth();
      const form = new multiparty.Form();

      async function parseForm() {
        return new Promise<{ fields: any; files: any }>((resolve, reject) => {
          form.parse(req, function (err, fields, files) {
            if (err) reject(err);
            resolve({ fields, files });
          });
        });
      }

      const { fields, files } = await parseForm();
      const tgUser = auth.getUserByInitData(fields.initData[0]);
      const user = await auth.register(tgUser, { ...fields, ...files });

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
    async handler({ req, request, user }) {
      const form = new multiparty.Form();
      const auth = new Auth();

      async function parseForm() {
        return new Promise<{ fields: any; files: any }>((resolve, reject) => {
          form.parse(req, function (err, fields, files) {
            if (err) reject(err);
            resolve({ fields, files });
          });
        });
      }

      const { fields, files } = await parseForm();
      const status = await auth.editUser(user.id, { ...fields, ...files });

      return {
        ok: status,
      };
    },
  },
];
