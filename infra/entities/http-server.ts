export interface HttpServer {
  listen(port: number, callback?: () => void): void;
}
