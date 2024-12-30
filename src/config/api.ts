export const API_CONFIG = {
  CONTESTS_URL: 'https://kontests.net/api/v1/all',
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 seconds
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
} as const;