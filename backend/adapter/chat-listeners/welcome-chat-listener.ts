import { DI } from "~/infra/di";

export class WelcomeChatListener {
  constructor() {
    this.#botApi.onMessage(this.#onMessage.bind(this));
    this.#botApi.onCommands(this.#onCommands.bind(this));
  }

  get #botApi() {
    return DI.get().botApi;
  }

  get #store() {
    return DI.get().store;
  }

  async #onMessage({ body }) {}

  async #onCommands({ command, body }) {
    if (command === "/start") {
      this.#onStart({ body });
    }
  }

  async #onStart({ body }) {
    const message = body.message;
    const from = message.from;

    this.#botApi.sendMessage({
      chat_id: message.chat.id,
      text: `
Welcome, ${from.first_name}!
I will help you find your soulmate, click on "Open App" and fun`,
    });
  }
}
