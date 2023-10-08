import crypto from "node:crypto";
import { nanoid } from "nanoid";

import { ObjectStorage } from "~/infra/object-storage";
import { DI } from "~/infra/di";
import { ValidationError } from "~/app/errors/validation-error";

import type { User } from "~/domain/user";
import type { MongoStore } from "~/infra/mongo-store";

interface TelegramUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
}

class Auth {
  #cookieName = "session_id";

  #store: MongoStore;

  #objectStorage: ObjectStorage;

  constructor() {
    this.#store = DI.get().store;
    this.#objectStorage = new ObjectStorage();
  }

  get cookieName(): string {
    return this.#cookieName;
  }

  get #users() {
    return this.#store.users;
  }

  get #sessions() {
    return this.#store.sessions;
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

  async #saveUser(user: User): Promise<boolean> {
    const result = await this.#users.insertOne(user);

    return result.acknowledged;
  }

  async #editUserById(
    userId: User["id"],
    input: Partial<User>
  ): Promise<boolean> {
    const result = await this.#users.updateOne({ id: userId }, { $set: input });

    return result.acknowledged;
  }

  async #uploadFile(file: Blob): Promise<string> {
    const types = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
    };
    const extension = (types as any)[file.type];
    const filename = `${nanoid()}.${extension}`;

    if (!extension) throw new Error("Invalid format of photo!");

    // Upload photo to object storage
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    const fileInfo = await this.#objectStorage.uploadFile(filename, fileBuffer);

    return `/image/${fileInfo.Key}`;
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
    const file = form.get("photo") as Blob;

    // Maybe user already exists?
    const dbUser = await this.getUserById(tgUser.id);
    if (dbUser) {
      return dbUser;
    }

    // TODO: Add the validation of form data
    if (!file) throw new Error("Photo is required!");

    const user = {
      ...tgUser,
      gender: String(form.get("gender")) || "",
      interestsGender: String(form.get("interests")) || "",
      ageRange: String(form.get("age-range")) || "",
      photo: await this.#uploadFile(file),
      restScores: 30,
    };

    await this.#saveUser(user);

    return user;
  }

  async editUser(userId: User["id"], form: FormData) {
    const file = form.get("photo") as Blob;
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    let input = {
      interestsGender: String(form.get("interests")) || user.interestsGender,
      ageRange: String(form.get("age-range")) || user.ageRange,
      photo: user.photo,
    };

    if (file && file.size > 0) {
      input.photo = await this.#uploadFile(file);
    }

    return await this.#editUserById(userId, input);
  }

  async decreaseScores(userId: User["id"]) {
    const result = await this.#users.updateOne(
      { id: userId },
      { $inc: { restScores: -1 } }
    );

    return result.acknowledged;
  }

  async addScores(userId: User["id"], scores: number) {
    const result = await this.#users.updateOne(
      { id: userId },
      { $inc: { restScores: scores } }
    );

    return result.acknowledged;
  }
}

export default Auth;
