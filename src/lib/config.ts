export const config = {
  apiUrl:        process.env.NEXT_PUBLIC_API_URL        ?? "http://localhost:4000/api",
  siteName:      process.env.NEXT_PUBLIC_SITE_NAME      ?? "Spoak",
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en",
  reownProjectId:process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "",
  sentryDsn:     process.env.NEXT_PUBLIC_SENTRY_DSN     ?? "",
};
