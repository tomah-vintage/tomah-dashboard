import { logger } from './logger';

/**
 * Base API Error class
 */
export class ApiError extends Error {
	public readonly statusCode: number;
	public readonly context?: Record<string, unknown>;

	constructor(message: string, statusCode: number, context?: Record<string, unknown>) {
		super(message);
		this.name = 'ApiError';
		this.statusCode = statusCode;
		this.context = context;
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}

/**
 * Validation Error - for input validation failures
 */
export class ValidationError extends Error {
	public readonly errors: Record<string, string[]>;

	constructor(message: string, errors: Record<string, string[]> = {}) {
		super(message);
		this.name = 'ValidationError';
		this.errors = errors;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

/**
 * Authentication Error - for auth failures
 */
export class AuthenticationError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number = 401) {
		super(message);
		this.name = 'AuthenticationError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, AuthenticationError.prototype);
	}
}

/**
 * Centralized error handler
 * Logs the error and returns a user-friendly message
 */
export function handleError(error: unknown, context?: string): { message: string; statusCode?: number } {
	// Handle ApiError
	if (error instanceof ApiError) {
		logger.error('API Error', error, {
			context: context || 'error_handler',
			statusCode: error.statusCode,
			...error.context
		});
		return {
			message: error.message,
			statusCode: error.statusCode
		};
	}

	// Handle ValidationError
	if (error instanceof ValidationError) {
		logger.error('Validation Error', error, {
			context: context || 'error_handler',
			errors: error.errors
		});
		return {
			message: error.message,
			statusCode: 400
		};
	}

	// Handle AuthenticationError
	if (error instanceof AuthenticationError) {
		logger.error('Authentication Error', error, {
			context: context || 'error_handler',
			statusCode: error.statusCode
		});
		return {
			message: error.message,
			statusCode: error.statusCode
		};
	}

	// Handle standard Error
	if (error instanceof Error) {
		logger.error('Unexpected Error', error, {
			context: context || 'error_handler'
		});
		return {
			message: error.message || 'An unexpected error occurred',
			statusCode: 500
		};
	}

	// Handle unknown error types
	logger.error('Unknown Error', undefined, {
		context: context || 'error_handler',
		error: String(error)
	});

	return {
		message: 'An unexpected error occurred',
		statusCode: 500
	};
}

/**
 * Parse error response from API
 */
export async function parseErrorResponse(response: Response): Promise<ApiError> {
	let errorMessage = 'An error occurred';
	let errorContext: Record<string, unknown> = {};

	try {
		const data = await response.json();
		errorMessage = data.message || data.detail || data.error || errorMessage;

		// Include additional error details if available
		if (data.errors) {
			errorContext.errors = data.errors;
		}
		if (data.code) {
			errorContext.code = data.code;
		}
	} catch {
		// If JSON parsing fails, try to get text
		try {
			errorMessage = await response.text();
		} catch {
			// Use default error message
		}
	}

	return new ApiError(errorMessage, response.status, errorContext);
}
