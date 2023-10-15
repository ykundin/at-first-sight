import type { User } from "~/domain/user";

export interface IPInfo {
  ip: string;
  hostname: string;
  country: {
    code: string;
    name: string;
  };
  region: {
    code: string;
    name: string;
  };
  city: string;
  latitude: number;
  longitude: number;
  security: {
    isAbuser: boolean;
    isVpn: boolean;
  };
  timeZone: {
    id: string;
    name: string;
  };
  currency: {
    code: string;
    name: string;
  };
}

export interface UserVisit {
  username: User["username"];
  ip: string;
  ipInfo: IPInfo;
}
