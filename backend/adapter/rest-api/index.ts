import { commonRoutes } from "./common";
import { authRoutes } from "./auth";
import { paymentsRoutes } from "./payments";
import { fireRoutes } from "./fire";

export const restApiRoutes = [
  ...commonRoutes,
  ...authRoutes,
  ...paymentsRoutes,
  ...fireRoutes,
];
