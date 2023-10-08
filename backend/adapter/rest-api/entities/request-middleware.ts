import type { User } from "../../../domain/user";
import type { HttpRequest } from "./http-request";

export type RequestMiddleware = (params: {
  request: HttpRequest;
  user: User;
}) => Promise<void>;
