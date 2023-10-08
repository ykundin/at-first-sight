import { commonRoutes } from "./common";
import { authRoutes } from "./auth";
import { paymentsRoutes } from "./payments";
import { fireRoutes } from "./fire";
import { recommendationsRoutes } from "./recommendations";
import { webhookRoutes } from "./webhook";

export const restApiRoutes = [
  ...commonRoutes,
  ...authRoutes,
  ...paymentsRoutes,
  ...fireRoutes,
  ...recommendationsRoutes,
  ...webhookRoutes,
];
