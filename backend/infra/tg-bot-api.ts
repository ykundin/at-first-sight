interface Listener {
  event: string;
  callback: (params: any) => void;
}

interface TgMessage {
  chat_id: string;
  text: string;
}

export class TgBotApi {
  #token: string;

  #host: string = "https://api.telegram.org";

  #listeners: Listener[] = [];

  constructor() {
    this.#token = process.env.TELEGRAM_BOT_API || "";
  }

  async setWebhook() {
    const url = process.env.PUBLIC_URL || "";

    return this.query("setWebhook", { url: `${url}/webhook` });
  }

  async sendMessage(message: TgMessage) {
    return this.query("sendMessage", message);
  }

  async query<T>(method: string, body?: Record<any, any>): Promise<T> {
    const pathNameChunks = ["", `bot${this.#token}`, method].filter((chunk) => {
      return typeof chunk === "string";
    });
    const path = pathNameChunks.join("/");

    const url = new URL(path, this.#host);
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    return data.result;
  }

  // Events

  emit(event: string, params: any): void {
    const listeners = this.#listeners.filter((listener) => {
      return listener.event === event;
    });

    listeners.forEach((listener) => listener.callback(params));
  }

  onMessage(callback: (params: any) => void): void {
    this.#listeners.push({ event: "message", callback });
  }

  onCommands(callback: (params: any) => void): void {
    this.#listeners.push({ event: "commands", callback });
  }

  onPreCheckoutQuery(callback: (params: any) => void): void {
    this.#listeners.push({ event: "pre_checkout_query", callback });
  }

  onSuccessfulPayment(callback: (params: any) => void): void {
    this.#listeners.push({ event: "successful_payment", callback });
  }

  onWebAppData(callback: (params: any) => void): void {
    this.#listeners.push({ event: "web_app_data", callback });
  }
}
