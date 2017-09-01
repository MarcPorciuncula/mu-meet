module.exports = {
  NODE_ENV: '"production"',
  GOOGLE_ANALYTICS_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_ID),
  BUILD_ID: JSON.stringify(process.env.COMMIT_SHA),
  SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
};
