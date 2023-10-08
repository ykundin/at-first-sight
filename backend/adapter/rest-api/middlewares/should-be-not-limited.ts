import { AccessDeniedError } from "../../../app/errors/access-denied-error";

import type { RequestMiddleware } from "../entities/request-middleware";

export const shouldBeNotLimited: RequestMiddleware = async ({ user }) => {
  if (user?.restScores < 1) throw new AccessDeniedError();
};
