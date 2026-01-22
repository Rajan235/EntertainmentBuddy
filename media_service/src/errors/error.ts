// src/utils/errors.ts

export class MediaNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaNotFoundError";
    // This is needed for the 'instanceof' check to work correctly in TS when extending built-ins
    Object.setPrototypeOf(this, MediaNotFoundError.prototype);
  }
}

export class ExternalApiError extends Error {
  constructor(serviceName: string, originalError: any) {
    super(
      `External API Error from ${serviceName}: ${originalError.message || originalError}`,
    );
    this.name = "ExternalApiError";
    Object.setPrototypeOf(this, ExternalApiError.prototype);
  }
}
// Add this to src/utils/errors.ts

export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
