import { ServiceError } from "./service-error";

interface Params {
  field: string;
  message: string;
}

export class ValidationError extends ServiceError {
  #field: Params["field"] = "";
  #message: Params["message"] = "";

  constructor(params: Params) {
    super(params.message);

    this.name = "ValidationError";
    this.#field = params.field;
    this.#message = params.message;
  }

  toObject() {
    return { field: this.#field, message: this.#message };
  }
}
