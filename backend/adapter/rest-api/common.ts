import type { HttpRoute } from "./entities/http-route";

export const commonRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/health",
    handler() {
      return Promise.resolve(`Backend is running on port ${process.env.PORT}!`);
    },
  },

  {
    method: "GET",
    path: "/api/emit-fake-error",
    handler() {
      throw new Error("This is fake error for debug!");
    },
  },
];
