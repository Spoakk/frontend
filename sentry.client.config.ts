import * as Sentry from "@sentry/nextjs";
import { config } from "@/lib/config";

Sentry.init({
  dsn: config.sentryDsn,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
});
