import { AccessDeniedError } from "../../../app/errors/access-denied-error";

import type { RequestMiddleware } from "../entities/request-middleware";

export const shouldBeAuth: RequestMiddleware = async ({ user }) => {
  if (!user) throw new AccessDeniedError();
};
