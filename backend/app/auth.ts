import crypto from "node:crypto";
import fs from "node:fs/promises";
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

export class Auth {
  #cookieName = "session_id";

  #store: MongoStore;

  #objectStorage: ObjectStorage;

  #admins: number[] = [];

  constructor() {
    this.#store = DI.get().store;
    this.#objectStorage = new ObjectStorage();
    this.#admins = (process.env.ADMINS || "")
      .split(",")
      .map((id) => Number(id));
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

  isAdmin(id: number): boolean {
    return this.#admins.includes(id);
  }

  async #editUserById(
    userId: User["id"],
    input: Partial<User>
  ): Promise<boolean> {
    const result = await this.#users.updateOne({ id: userId }, { $set: input });

    return result.acknowledged;
  }

  async #editUserByUsername(
    username: User["username"],
    input: Partial<User>
  ): Promise<User | null> {
    const result = await this.#users.updateOne({ username }, { $set: input });
    const user = result.acknowledged
      ? await this.getUserByUsername(username)
      : null;

    return user;
  }

  async #uploadFile(file: any): Promise<string> {
    const chunks = file.originalFilename.split(".");
    const extension = chunks[chunks.length - 1];
    const filename = `${nanoid()}.${extension}`;

    if (!extension) throw new Error("Invalid format of photo!");

    // Upload photo to object storage
    const fileBuffer = await fs.readFile(file.path);
    const fileInfo = await this.#objectStorage.uploadFile(filename, fileBuffer);

    return `/image/${fileInfo.Key}`;
  }

  async getUserById(id: User["id"]): Promise<User | null> {
    const user = await this.#users.findOne({ id });

    return user;
  }

  async getUserByUsername(username: User["username"]): Promise<User | null> {
    const user = await this.#users.findOne({ username });

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

  async register(tgUser: TelegramUser, form: any): Promise<User | null> {
    const [photo] = form.photo;
    const [ageRange] = form["age-range"];
    const [interests] = form.interests;
    const [gender] = form.gender;
    const [description] = form.description || [undefined];

    // TODO: Add the validation of form data
    if (!photo || photo.size < 1) throw new Error("Photo is required!");

    const user = {
      ...tgUser,
      gender: gender,
      interestsGender: interests,
      ageRange: ageRange,
      photo: await this.#uploadFile(photo),
      description: description,
      restScores: 30,
    };

    return await this.#editUserByUsername(tgUser.username, user);
  }

  async updateUser(user: Partial<User>): Promise<User | null> {
    const input = {
      firstName: user.firstName,
      lastName: user.lastName,
      languageCode: user.languageCode,
    };
    const editedUser = await this.#editUserByUsername(user.username, input);

    return editedUser;
  }

  async createUser(tgUser: TelegramUser): Promise<User | null> {
    const result = await this.#users.insertOne({
      ...tgUser,
      gender: undefined,
      interestsGender: undefined,
      ageRange: undefined,
      photo: undefined,
      restScores: 30,
    });
    const user = result.acknowledged
      ? await this.getUserByUsername(tgUser.username)
      : null;

    return user;
  }

  async editUser(userId: User["id"], form: any) {
    const [photo] = form.photo;
    const [ageRange] = form["age-range"];
    const [interests] = form.interests;
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    let input = {
      interestsGender: interests || user.interestsGender,
      ageRange: ageRange || user.ageRange,
      photo: user.photo,
    };

    if (photo && photo.size > 0) {
      input.photo = await this.#uploadFile(photo);
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
