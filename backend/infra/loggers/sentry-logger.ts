import * as Sentry from "@sentry/node";

import type { Logger } from "~/infra/entities/logger";

export class SentryLogger implements Logger {
  constructor() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });
  }

  log(message: string): void {
    Sentry.captureMessage(message);
  }

  error(error: unknown): void {
    Sentry.captureException(error);
  }
}
