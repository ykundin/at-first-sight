import type { HttpRoute } from "./entities/http-route";

export const authRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/get-user",
    handler() {
      return Promise.resolve({ ok: true, data: null });
    },
  },
];
