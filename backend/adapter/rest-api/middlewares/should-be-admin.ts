import { AccessDeniedError } from "../../../app/errors/access-denied-error";

import type { RequestMiddleware } from "../entities/request-middleware";

export const shouldBeAdmin: RequestMiddleware = async ({ request, user }) => {
  if (request.query.get("token") !== process.env.ADMIN_TOKEN) {
    throw new AccessDeniedError();
  }
};
