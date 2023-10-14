import { DI } from "~/infra/di";

import type { HttpRoute } from "./entities/http-route";

export const webhookRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/webhook",
    async handler({ request }) {
      const botApi = DI.get().botApi;

      if (request.body.message) {
        const message = request.body.message;

        botApi.emit("message", { body: request.body });

        if (message.successful_payment) {
          botApi.emit("successful_payment", { body: request.body });
        }

        if (message.web_app_data) {
          botApi.emit("web_app_data", { body: request.body });
        }

        if (message.entities?.length > 0) {
          message.entities.forEach((entity) => {
            if (entity.type === "bot_command") {
              const command = message.text.slice(entity.offset, entity.length);

              botApi.emit("commands", { command, body: request.body });
            }
          });
        }
      }

      if (request.body.pre_checkout_query) {
        botApi.emit("pre_checkout_query", { body: request.body });
      }

      return { ok: true };
    },
  },
];
