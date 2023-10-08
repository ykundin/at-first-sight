import { commonRoutes } from "./common";
import { authRoutes } from "./auth";
import { paymentsRoutes } from "./payments";
import { fireRoutes } from "./fire";
import { recommendationsRoutes } from "./recommendations";

export const restApiRoutes = [
  ...commonRoutes,
  ...authRoutes,
  ...paymentsRoutes,
  ...fireRoutes,
  ...recommendationsRoutes,
];
