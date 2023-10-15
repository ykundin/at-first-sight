import { MongoClient } from "mongodb";

import type { Collection, Db } from "mongodb";
import type { User } from "~/domain/user";
import type { Session } from "~/domain/session";
import type { UserVisit } from "~/domain/user-visit";

export class MongoStore {
  #client: MongoClient;
  #db: Db;
  #users: Collection<User>;
  #sessions: Collection<Session>;
  #visits: Collection<UserVisit>;

  constructor() {
    this.#client = new MongoClient(process.env.MONGO_URI || "");
    this.#db = this.#client.db(process.env.MONGO_DB || "");
    this.#users = this.#db.collection("users");
    this.#sessions = this.#db.collection("sessions");
    this.#visits = this.#db.collection("visits");
  }

  get users() {
    return this.#users;
  }

  get sessions() {
    return this.#sessions;
  }

  get visits() {
    return this.#visits;
  }
}
