# С первого взгляда! / Регистрация и авторизация

Наша с вами задача на данном шаге — реализовать регистрацию пользователя при первом входе в наше приложение, а при повторном автоматически проходить авторизацию. Я постараюсь подробно разобрать схему работы и те возможности, которые нам предоставляет Telegram, но кода уже будет заметно больше, поэтому не стесняйтесь заглядывать прямо в код (особенно на класс Auth).

## Получение информации о пользователе

<img align="right" width="300" height="169" src="../images/auth-reg/check-user.png">

На самом деле во время открытия приложения Telegram сразу предоставляет нам информацию о пользователе. Но для того, чтобы убедиться в том, что эту информацию не подделами Telegram предоставляет алгорит для проверки данных — [смотреть в документации](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).

1. **Отправляем initData**

   Для начала давайте слегка перепишем хук `useUser` и будем передавать на бэкенд всю информацию, которую предоставляет нам Telegram:

   ```tsx
   import { useQuery } from "@tanstack/react-query";

   function useUser() {
     return useQuery({
       queryKey: ["user"],
       queryFn: async () => {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const initData = (window as any).Telegram.WebApp.initData; // Информация от Telegram

         // Отправим эту информацию на бэкенд с помощью POST-метода и JSON
         const res = await fetch(`/api/get-user`, {
           method: "POST",
           headers: {
             ContentType: "application/json",
           },
           body: JSON.stringify({ initData }),
         });
         const result = await res.json();

         if (!result.ok) {
           throw new Error(result.error);
         }

         return result.data;
       },
     });
   }

   export default useUser;
   ```

2. **Проверяем пользователя на бэкенде**

   А теперь реализуем алгоритм для проверки той информации, которую мы получили от клиента, чтобы убедиться, что она действительно корректная и ей можно доверять:

   ```tsx
   import crypto from "node:crypto";
   import { ValidationError } from "../app/errors/validation-error";

   class Auth {
     getUserByInitData(inputInitData: string): User {
       const initData = new URLSearchParams(inputInitData || "");
       const inputUser = initData.get("user") || "null";
       const inputHash = initData.get("hash") || "";

       // Используем токен от BotFather
       const token = process.env.TELEGRAM_BOT_API || "";

       // Подготавливаем параметры
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

       // Формируем новый хэш и проверяем, что он совпадает с тем, что передал нам Telegram
       const secretKey = crypto
         .createHmac("sha256", "WebAppData")
         .update(token);
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
         // Если всё хорошо, то информации можно доверять
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
   ```

3. **Работа с токеном**

   Обратите внимание, что внутри алгоритма нам нужен секретный токен, который мы получили от BotFather во время регистрации нашего бота. Крайне не рекомендую сохранять данный токен в коде приложения, так как данный токен даёт полный доступ к вашему боту и это не безопасно.

   Вместо этого используют так называемые переменные окружения, которые сохраняются в файле `/backend/.env`, а затем их можно получать внутри кода приложения с помощью вот такой записи — `process.env.TELEGRAM_BOT_API`, где `TELEGRAM_BOT_API` это название переменной и может быть любым.

   Данный файл не должен находиться в Git-репозитории, поэтому проследите, что он был добавлен в `.gitignore`. Содержимое файла для примера:

   ```bash
   TELEGRAM_BOT_API=6406180840:AAFpHAa-a5IMDM25kef2tbScNCX8PjKy2a
   ```
