import { DI } from "~/infra/di";

import type { Order } from "~/domain/order";
import type { TgBotApi } from "~/infra/tg-bot-api";

class Payments {
  #botApi: TgBotApi;

  constructor() {
    this.#botApi = DI.get().botApi;
  }

  async #createInvoiceLink(order: Order): Promise<string> {
    const link = this.#botApi.query<string>("createInvoiceLink", {
      ...order,
      provider_token: process.env.TELEGRAM_YOOKASSA_TOKEN,
    });

    return link;
  }

  async unlockProfile(params: {
    currentUserId: number;
    requestUserId: number;
  }): Promise<string> {
    const orderInfo = {
      title: "Unlock the profile",
      description: "Unlocks the profile that showed interests to you",
      currency: "RUB",
      prices: [
        {
          label: "Price",
          amount: 100 * 100,
        },
      ],
      payload: JSON.stringify({
        paymentId: "test",
        currentUserId: params.currentUserId,
        requestUserId: params.requestUserId,
      }),
    };

    return this.#createInvoiceLink(orderInfo);
  }

  async buyScores(params: { currentUserId: number }): Promise<string> {
    const orderInfo = {
      title: "Buy 100 scores",
      description: "You will get another 100 points to evaluate other people",
      currency: "RUB",
      prices: [
        {
          label: "Price",
          amount: 100 * 100,
        },
      ],
      payload: JSON.stringify({
        paymentId: "test",
        currentUserId: params.currentUserId,
        scores: 100,
      }),
    };

    return this.#createInvoiceLink(orderInfo);
  }
}

export default Payments;
