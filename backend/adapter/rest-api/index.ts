import { commonRoutes } from "./common";
import { authRoutes } from "./auth";

export const restApiRoutes = [...commonRoutes, ...authRoutes];
