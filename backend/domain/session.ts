import type { User } from "~/domain/user";

export interface Session {
  id: string;
  userId: User["id"];
}
