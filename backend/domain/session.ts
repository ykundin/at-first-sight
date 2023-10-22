import type { User } from "~/domain/user";

export interface Session {
  id: string;
  username: User["username"];
}
