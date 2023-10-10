# At first sight! / Project Setup

## Bot Registration

<img align="right" width="300" height="300" src="../images/create-bot/botfather.jpg">

Absolutely all Web Apps in Telegram are a bot that needs to be registered. This is an automated and very simple process that takes literally a few minutes.

1. Go to the official bot from Telegram — [BotFather](https://t.me/BotFather);
2. Send him the command `/start`
3. Next, the command to create a new bot is `/newbot` — in response, it will ask us to choose a name for the bot, a description, and so on;
4. As a result, we will get a token for accessing the HTTP API, looking something like this `6411545841:AAGFWxhLIMjZE5dSGA9CEPj2KT-jp4xled8` and which needs to be saved;
5. This token is very important and should be kept secret, as it can be used to gain full access to your bot;

## Project preparation

Now we need to prepare all the necessary tools to start convenient development. Two mandatory things are necessary for our task:

1. Any code editor, for example, VSCode

   This editor is completely free, suitable for any operating system, has a huge set of features that are enough to complete our task. If you don't have it, then you can download and install it from the official website

   [Install VSCode](https://code.visualstudio.com/docs/setup/setup-overview)

1. Bun to run the code

   And the second mandatory program for development is Bun. This tool allows you to run TypeScript code, install the necessary packages, and configure everything you need to work much easier and faster. And it also has almost all the features of NodeJS, works faster and is also suitable for any operating system.

   [Install Bun](https://bun.sh/)

1. Check that everything is fine

   Let's open a terminal inside VSCode and execute a simple command there:

   ```
   bun -v
   ```

   If you received something in the spirit of `1.0.3` in response, then everything is going according to plan and we can continue

Well, finally we can start writing code! To begin with, let's learn how to create an empty application with you and open it inside Telegram, and after that we will start working out the logic inside the application.

[Creating an frontend application](./03-create-frontend-project.md)
