import type { IPInfo } from "~/domain/user-visit";

export interface IPInformer {
  getByIp(ip: string): Promise<IPInfo | null>;
}
