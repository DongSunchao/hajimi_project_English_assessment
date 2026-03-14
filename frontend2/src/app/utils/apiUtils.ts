/**
 * API Utility Functions
 * 
 * Helper functions for API communication and data transformation.
 */

/**
 * Unwraps AWS Lambda response body
 * Handles both string and object body formats
 */
export const unwrapBody = (raw: any): any => {
  if (raw.body) {
    return typeof raw.body === 'string' ? JSON.parse(raw.body) : raw.body;
  }
  return raw;
};

/**
 * Joins base URL with path, handling trailing/leading slashes
 */
export const joinApiUrl = (baseUrl: string, path: string): string => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBaseUrl}/${normalizedPath}`;
};

/**
 * Creates headers for API requests
 */
export const createHeaders = (additionalHeaders?: Record<string, string>) => {
  return {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
};

/**
 * Generic API error handler
 */
export const handleApiError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unknown error occurred');
};
