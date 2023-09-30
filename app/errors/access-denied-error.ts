import { ServiceError } from "~/app/errors/service-error";

export class AccessDeniedError extends ServiceError {
  constructor() {
    super("Access denied!");
    this.name = "AccessDeniedError";
  }
}
