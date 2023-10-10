class TgBotApi {
  #token: string;

  #host: string = "https://api.telegram.org";

  constructor() {
    this.#token = process.env.TELEGRAM_BOT_API || "";
  }

  async setWebhook() {
    return this.query("setWebhook", { url: process.env.PUBLIC_URL || "" });
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
}

export default TgBotApi;
