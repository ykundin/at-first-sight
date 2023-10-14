import cookieParser from "cookie-parser";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

import Auth from "~/app/auth";
import { ValidationError } from "~/app/errors/validation-error";
import { ServiceError } from "~/app/errors/service-error";
import { restApiRoutes } from "~/adapter/rest-api";
import { HttpRequest } from "~/adapter/rest-api/entities/http-request";
import TgBotApi from "./tg-bot-api";

import type { HttpRoute } from "~/adapter/rest-api/entities/http-route";
import type { HttpResponse } from "~/adapter/rest-api/entities/http-response";
import type { HttpServer } from "~/infra/entities/http-server";

export class ExpressHttpServer implements HttpServer {
  #auth: Auth;
  #botApi: TgBotApi;
  #server: Express;

  constructor() {
    this.#auth = new Auth();
    this.#botApi = new TgBotApi();
    this.#server = express();

    // Set up the http server
    this.#server.disable("x-powered-by");
    this.#server.use(express.json({ limit: "5mb" }));
    this.#server.use(express.urlencoded({ extended: true }));
    this.#server.use(cookieParser());

    this.#server.use((req, res) => {
      const url = new URL(req.url, `${req.protocol}://${req.hostname}`);

      // Handle all REST API routes
      const route = restApiRoutes.find((route) => {
        if (req.method !== route.method) return false;
        if (url.pathname !== route.path) return false;

        return true;
      });

      if (!route) {
        return new Response("Not found!", { status: 404 });
      }

      this.#createRequestHandler(route)(req, res);
    });

    this.#server.use((error: any, req: any, res: any, next: any) => {
      // It is validation error
      if (error instanceof ValidationError) {
        res.status(500).json({
          ok: false,
          error: error.toObject(),
        });
      }

      // It's known error, send as response
      if (error instanceof ServiceError) {
        res.status(500).json({ ok: false, error: { message: error.message } });
      }

      // It's unknown error, log full error and send as dump info as response
      console.error(error);

      res.status(500).json({
        ok: false,
        error: { ok: false, error: { message: "Unknown error" } },
      });
    });
  }

  #createRequestHandler(route: HttpRoute) {
    const requestHandler = async (
      req: ExpressRequest,
      res: ExpressResponse
    ) => {
      const url = new URL(req.url, `${req.protocol}://${req.hostname}`);
      const userAgent = req.headers["user-agent"] || "";
      const ip = String(req.headers["x-forwarded-for"]);

      // Try to find user by sessionId in cookies
      const sessionId = req.cookies[this.#auth.cookieName];
      const user: any = await this.#auth.getUserFromSession(sessionId);

      const request = new HttpRequest({
        query: url.searchParams as any,
        body: req.body,
        userAgent: userAgent,
        ip: ip,
      });

      const response: HttpResponse = {
        setCookie: res.cookie.bind(res),
      };

      // Run the before middlewares
      await Promise.all(
        (route.before || []).map((middleware) => middleware({ request, user }))
      );

      const result = await route.handler({ req, request, response, user });

      if (typeof result === "string") {
        res.header("Content-Type", "text/plain").send(result);
      }

      res.json(result);
    };

    return requestHandler;
  }

  async listen(port: number, callback?: () => void): Promise<void> {
    await this.#botApi.setWebhook();

    this.#server.listen(port, callback);
  }
}
