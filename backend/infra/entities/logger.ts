export interface Logger {
  log(message: string): void;

  error(error: unknown): void;
}
