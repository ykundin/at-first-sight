import { DI } from "~/infra/di";

import type { Order } from "~/domain/order";
import type { TgBotApi } from "~/infra/tg-bot-api";
import type { User } from "~/domain/user";

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
    currentUsername: User["username"];
    requestUsername: User["username"];
  }): Promise<string> {
    const { currentUsername, requestUsername } = params;

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
        currentUsername,
        requestUsername,
      }),
    };

    return this.#createInvoiceLink(orderInfo);
  }

  async buyScores(params: {
    currentUsername: User["username"];
  }): Promise<string> {
    const { currentUsername } = params;

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
        currentUsername: currentUsername,
        scores: 100,
      }),
    };

    return this.#createInvoiceLink(orderInfo);
  }
}

export default Payments;
