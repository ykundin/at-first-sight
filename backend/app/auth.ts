import crypto from "node:crypto";
import { ValidationError } from "../app/errors/validation-error";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
}

class Auth {
  #cookieName = "session_id";

  getUserByInitData(inputInitData: string): User {
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
}

export default Auth;
