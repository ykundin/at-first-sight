export interface CookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  encode?: (val: string) => string;
  sameSite?: boolean | "lax" | "strict" | "none";
}

export interface HttpResponse {
  setCookie(name: string, value: string, options?: CookieOptions): void;
}
