import { commonRoutes } from "./common";
import { authRoutes } from "./auth";
import { paymentsRoutes } from "./payments";

export const restApiRoutes = [
  ...commonRoutes,
  ...authRoutes,
  ...paymentsRoutes,
];
