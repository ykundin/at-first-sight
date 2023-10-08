import crypto from "node:crypto";
import { nanoid } from "nanoid";
import { MongoClient } from "mongodb";

import { ObjectStorage } from "../infra/object-storage";
import { ValidationError } from "../app/errors/validation-error";

import type { Collection, Db } from "mongodb";
import type { User } from "../domain/user";

interface TelegramUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
}

interface Session {
  id: string;
  userId: User["id"];
}

class Auth {
  #cookieName = "session_id";

  #client: MongoClient;
  #db: Db;
  #users: Collection<User>;
  #sessions: Collection<Session>;

  #objectStorage: ObjectStorage;

  constructor() {
    this.#client = new MongoClient(process.env.MONGO_URI || "");
    this.#db = this.#client.db(process.env.MONGO_DB || "");
    this.#users = this.#db.collection("users");
    this.#sessions = this.#db.collection("sessions");

    this.#objectStorage = new ObjectStorage();
  }

  get cookieName(): string {
    return this.#cookieName;
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

  async createSession(userId: User["id"]): Promise<string | null> {
    const sessionId = nanoid();
    const result = await this.#sessions.insertOne({
      id: sessionId,
      userId: userId,
    });

    return result.acknowledged ? sessionId : null;
  }

  async getUserFromSession(sessionId: string): Promise<User | null> {
    const session = await this.#sessions.findOne({ id: sessionId });
    const user = session ? await this.getUserById(session.userId) : null;

    return user;
  }

  async register(form: FormData, tgUser: TelegramUser): Promise<User> {
    const types = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
    };
    const file = form.get("photo") as Blob;
    const extension = (types as any)[file.type];
    const filename = `${nanoid()}.${extension}`;

    // TODO: Add the validation of form data
    if (!file) throw new Error("Photo is required!");
    if (!extension) throw new Error("Invalid format of photo!");

    // Maybe user already exists?
    const dbUser = await this.getUserById(tgUser.id);
    if (dbUser) {
      return dbUser;
    }

    // Upload photo to object storage
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    const fileInfo = await this.#objectStorage.uploadFile(filename, fileBuffer);

    const user = {
      ...tgUser,
      gender: String(form.get("gender")) || "",
      interestsGender: String(form.get("interests")) || "",
      ageRange: String(form.get("age-range")) || "",
      photo: `/image/${fileInfo.Key}`,
    };

    await this.saveUser(user);

    return user;
  }
}

export default Auth;
