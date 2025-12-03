type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
	[key: string]: unknown;
}

class Logger {
	private isDevelopment: boolean;

	constructor() {
		this.isDevelopment = import.meta.env.DEV;
	}

	private log(level: LogLevel, message: string, context?: LogContext): void {
		const timestamp = new Date().toISOString();
		const logEntry = {
			timestamp,
			level,
			message,
			...context
		};

		if (this.isDevelopment) {
			// Pretty console output for development
			const emoji = {
				debug: '🔍',
				info: 'ℹ️',
				warn: '⚠️',
				error: '❌'
			}[level];

			console[level === 'debug' ? 'log' : level](
				`${emoji} [${timestamp}] ${message}`,
				context || ''
			);
		} else {
			// Structured JSON output for production
			console.log(JSON.stringify(logEntry));
		}
	}

	debug(message: string, context?: LogContext): void {
		if (this.isDevelopment) {
			this.log('debug', message, context);
		}
	}

	info(message: string, context?: LogContext): void {
		this.log('info', message, context);
	}

	warn(message: string, context?: LogContext): void {
		this.log('warn', message, context);
	}

	error(message: string, error?: Error | unknown, context?: LogContext): void {
		const errorContext = {
			...context,
			...(error instanceof Error && {
				error: {
					message: error.message,
					stack: error.stack,
					name: error.name
				}
			})
		};
		this.log('error', message, errorContext);
	}
}

export const logger = new Logger();
