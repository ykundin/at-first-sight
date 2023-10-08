import crypto from "node:crypto";
import { MongoClient } from "mongodb";

import { ValidationError } from "../app/errors/validation-error";

import type { Collection, Db } from "mongodb";

interface TelegramUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
  gender: string;
  interestsGender: string;
  ageRange: string;
  photo: any;
}

class Auth {
  #cookieName = "session_id";

  #client: MongoClient;
  #db: Db;
  #users: Collection<User>;

  constructor() {
    this.#client = new MongoClient(process.env.MONGO_URI || "");
    this.#db = this.#client.db(process.env.MONGO_DB || "");
    this.#users = this.#db.collection("users");
  }

  getUserByInitData(inputInitData: string): TelegramUser {
    const initData = new URLSearchParams(inputInitData || "");
    const inputUser = initData.get("user") || "null";
    const inputHash = initData.get("hash") || "";
    const token = process.env.TELEGRAM_BOT_API || "";

    const inputParams: {
      key: string;
      value: string;
    }[] = [];
    initData.forEach((value, key) => {
      if (key === "hash") return;
      inputParams.push({ key, value });
    });

    const sortedInputParams = inputParams.sort((a, b) => {
      return a.key.localeCompare(b.key);
    });

    const dataCheckString = sortedInputParams
      .map(({ key, value }) => `${key}=${value}`)
      .join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(token);

    const baseHash = crypto
      .createHmac("sha256", secretKey.digest())
      .update(dataCheckString)
      .digest("hex");

    if (baseHash !== inputHash) {
      throw new ValidationError({
        field: "hash",
        message: "Incorrect auth hash",
      });
    }

    try {
      const tgUser = JSON.parse(inputUser);

      return {
        id: tgUser.id,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        username: tgUser.username,
        languageCode: tgUser.language_code,
      };
    } catch (e) {
      throw new ValidationError({
        field: "user",
        message: "Incorrect format of user",
      });
    }
  }

  async saveUser(user: User): Promise<boolean> {
    const result = await this.#users.insertOne(user);

    return result.acknowledged;
  }

  async getUserById(userId: User["id"]): Promise<User | null> {
    const user = await this.#users.findOne({ id: userId });

    return user;
  }

  async register(form: FormData, tgUser: TelegramUser): Promise<User> {
    // TODO: Add the validation of form data

    // Maybe user already exists?
    const dbUser = await this.getUserById(tgUser.id);
    if (dbUser) {
      return dbUser;
    }

    const user = {
      ...tgUser,
      gender: String(form.get("gender")) || "",
      interestsGender: String(form.get("interests")) || "",
      ageRange: String(form.get("age-range")) || "",

      // TODO: Upload photo to Object Store
      photo: "",
    };

    await this.saveUser(user);

    return user;
  }
}

export default Auth;
