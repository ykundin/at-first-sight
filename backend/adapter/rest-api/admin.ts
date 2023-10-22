import multiparty from "multiparty";

import { Auth } from "~/app/auth";
import { shouldBeAdmin } from "./middlewares/should-be-admin";

import type { HttpRoute } from "./entities/http-route";
import { ValidationError } from "~/app/errors/validation-error";

export const adminRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/api/admin/add-user",
    before: [shouldBeAdmin],
    async handler({ req, response }) {
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
      const tgUser = {
        id: fields.telegramId[0],
        firstName: fields.firstName[0],
        lastName: fields.lastName[0],
        username: fields.username[0],
        languageCode: fields.languageCode[0],
      };

      const user = await auth.register(tgUser, { ...fields, ...files });

      return {
        ok: true,
        data: user,
      };
    },
  },
];