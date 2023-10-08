import { MongoClient } from "mongodb";

import type { Collection, Db } from "mongodb";
import type { User } from "../domain/user";

interface Session {
  id: string;
  userId: User["id"];
}

export class MongoStore {
  #client: MongoClient;
  #db: Db;
  #users: Collection<User>;
  #sessions: Collection<Session>;

  constructor() {
    this.#client = new MongoClient(process.env.MONGO_URI || "");
    this.#db = this.#client.db(process.env.MONGO_DB || "");
    this.#users = this.#db.collection("users");
    this.#sessions = this.#db.collection("sessions");
  }

  get users() {
    return this.#users;
  }

  get sessions() {
    return this.#sessions;
  }
}
