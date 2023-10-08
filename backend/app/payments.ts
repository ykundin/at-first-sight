import TgBotApi from "~/infra/tg-bot-api";

type OrderType = "unlock-profile";

interface LabeledPrice {
  label: string;
  amount: number;
}

interface Order {
  title: string;
  description: string;
  currency: string;
  prices: LabeledPrice[];
  payload: string;
}

const orders: Record<OrderType, Order> = {
  "unlock-profile": {
    title: "Unlock the profile",
    description: "Unlocks the profile that showed interests to you",
    currency: "RUB",
    prices: [
      {
        label: "Price",
        amount: 100 * 100,
      },
    ],
    payload: "",
  },
};

class Payments {
  #botApi: TgBotApi;

  constructor() {
    this.#botApi = new TgBotApi();
  }

  async #createInvoiceLink(order: Order): Promise<string> {
    const link = this.#botApi.query<string>("createInvoiceLink", {
      ...order,
      provider_token: process.env.YOOKASSA_TOKEN,
    });

    return link;
  }

  async unlockProfile(params: {
    currentUserId: number;
    requestUserId: number;
  }): Promise<string> {
    const orderInfo = orders["unlock-profile"];
    const payload = JSON.stringify({
      paymentId: "test",
      currentUserId: params.currentUserId,
      requestUserId: params.requestUserId,
    });

    return this.#createInvoiceLink({ ...orderInfo, payload });
  }
}

export default Payments;
