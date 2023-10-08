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

## Регистрация пользователя

Логика регистрация пользователя никак не зависит от Telegram и может различаться в зависимости от типа приложения, а некоторым приложениям это вообще не нужно. В нашем приложении регистрация пользователя нужна, поэтому я коротко расскажу о самом важном в этом процессе.

1. **Отправляем запрос на регистрацию**

   Для начала нужно реализовать передачу всех данных для регистрации со стороны приложения. В моём случае при первом визите в приложение у пользователя есть экран с дополнительными вопросами. После ответа на все вопросы, мы просим пользователя выбрать фотографию, а затем отправляем это на бэкенд в виде POST-запроса на адрес `/api/registration`.

   [Посмотреть код компонента](https://github.com/ykundin/at-first-sight/blob/docs/tg-web-app/src/screens/welcome-screen/elems/messages-step/messages-step.tsx) (ищите функцию `handleSubmit`)

2. **Пишем обработчик запроса**

   А теперь необходимо добавить обработчик на бэкенде для данного запроса:

   ```tsx
   {
       method: "POST",
       path: "/api/registration",
       async handler({ request }) {
         const auth = new Auth();
         const tgUser = auth.getUserByInitData(request.body.get("initData"));
         const user = await auth.register(request.body, tgUser);

         return {
           ok: true,
           data: user,
         };
       },
     },
   ```

3. **Реализуем регистрацию**

   Как видите, обработчик запроса служит лишь для того, чтобы вызвать нужный метод в классе `Auth`, передав в него информацию из запроса. Давайте детальнее посмотрим на этот класс и метод `register`:

   ```tsx
   import crypto from "node:crypto";
   import { MongoClient } from "mongodb";

   import { ValidationError } from "../app/errors/validation-error";

   import type { Collection, Db } from "mongodb";

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
   ```

   Как видите, на данном этапе я полностью пропустил стадию с валидацией полученных данных, а также не реализовал логику с сохранением фотографии пользователя. Но, разумеется, это обязательно сделать до того, как ваше приложение попадёт в продакшн. Мы займёмся этим чуть позже.

   [Открыть файл](https://github.com/ykundin/at-first-sight/blob/docs/backend/app/auth.ts)

4. **Взаимодействие с базой данных**

   <img align="right" width="300" height="169" src="../images/auth-reg/user-in-database.png">

   А также обратите внимание на конструктор внутри класса `Auth` — здесь мы создаём соединение с базой данных, а все необходимые данные для этого берём из переменных окружения. А значит пришла пора отредактировать файл `/backend/.env`:

   ```bash
   TELEGRAM_BOT_API=6406180840:AAFpHAa-a5IMDM25kef2tbScNCX8PjKy2a
   MONGO_URI=mongodb://kundin:very-secret-password@db:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true
   MONGO_DB=at-first-sight
   ```

   Все необходимые параметры для базы данных мы с вами уже указали в файле `docker-compose.dev.yml`. Обратите внимание, что для применения новых переменных окружения необходимо полностью перезапустить приложение в Docker. А для того, чтобы удобно смотреть то, что было в итоге сохранено в базу данных я рекомендую установить [расширение для VS Code](https://github.com/mongodb-js/vscode).
