import { Auth } from "~/app/auth";
import { AccessDeniedError } from "~/app/errors/access-denied-error";
import { DI } from "~/infra/di";

export class StatsChatListener {
  #auth: Auth;

  constructor() {
    this.#auth = new Auth();
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
    if (command === "/stats") {
      this.#onStats({ body });
    }
  }

  async #onStats({ body }) {
    const message = body.message;
    const from = message.from;

    if (!this.#auth.isAdmin(from.id)) {
      throw new AccessDeniedError();
    }

    const users = await this.#store.users.find().toArray();
    const men = users.filter((user) => user.gender === "man");
    const women = users.filter((user) => user.gender === "woman");

    this.#botApi.sendMessage({
      chat_id: message.chat.id,
      text: `
STATS:
Users: ${users.length} (men: ${men.length}, women: ${women.length});
      `,
    });
  }
}
