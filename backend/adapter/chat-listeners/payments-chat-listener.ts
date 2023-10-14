import Auth from "~/app/auth";
import { DI } from "~/infra/di";

import type { TgBotApi } from "~/infra/tg-bot-api";

export class PaymentsChatListener {
  #botApi: TgBotApi = null;

  #auth: Auth = null;

  constructor() {
    this.#botApi = DI.get().botApi;
    this.#auth = new Auth();

    this.#botApi.onMessage(this.#onMessage.bind(this));
    this.#botApi.onPreCheckoutQuery(this.#onPreCheckoutQuery.bind(this));
    this.#botApi.onSuccessfulPayment(this.#onSuccessfulPayment.bind(this));
  }

  async #onMessage({ body }) {}

  async #onPreCheckoutQuery({ body }) {
    // TODO: Check the payment!
    await this.#botApi.query("answerPreCheckoutQuery", {
      ok: true,
      pre_checkout_query_id: body.pre_checkout_query.id,
    });
  }

  async #onSuccessfulPayment({ body }) {
    const payment = body.message.successful_payment;
    const payload = JSON.parse(payment.invoice_payload);

    console.log("New payment", payment);
    await this.#auth.addScores(payload.currentUserId, payload.scores);
  }
}
