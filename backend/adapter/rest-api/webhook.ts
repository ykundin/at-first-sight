import TgBotApi from "~/infra/tg-bot-api";
import Auth from "~/app/auth";

import type { HttpRoute } from "./entities/http-route";

export const webhookRoutes: HttpRoute[] = [
  {
    method: "POST",
    path: "/webhook",
    async handler({ request }) {
      const botApi = new TgBotApi();
      const auth = new Auth();

      // TODO: Check the payment!
      if (request.body.pre_checkout_query) {
        await botApi.query("answerPreCheckoutQuery", {
          ok: true,
          pre_checkout_query_id: request.body.pre_checkout_query.id,
        });
      }

      // Info about success payment
      if (request.body.message?.successful_payment) {
        const payment = request.body.message.successful_payment;
        const payload = JSON.parse(payment.invoice_payload);

        console.log("New payment", payment);
        await auth.addScores(payload.currentUserId, payload.scores);
      }

      return { ok: true };
    },
  },
];
