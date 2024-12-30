export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public retryCount?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};