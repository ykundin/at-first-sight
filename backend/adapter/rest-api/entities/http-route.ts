import type { User } from "../../../domain/user";
import type { HttpRequest } from "./http-request";
import type { HttpResponse } from "./http-response";
import type { RequestMiddleware } from "./request-middleware";

export interface HttpRoute {
  method: "GET" | "POST";
  path: string;
  before?: RequestMiddleware[];
  handler(params: {
    request: HttpRequest;
    response: HttpResponse;
    user: User;
  }): Promise<unknown>;
}
