import { z } from 'zod';

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  errorsByField?: Record<string, string[]>;
}

/**
 * Validates data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns ValidationResult with data or errors
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      const errorsByField: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        if (!errorsByField[field]) {
          errorsByField[field] = [];
        }
        errorsByField[field].push(err.message);
      });

      return {
        success: false,
        errors,
        errorsByField,
      };
    }

    // Unknown error
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    };
  }
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers like onclick=
}

/**
 * Sanitizes HTML content by removing script tags and dangerous attributes
 * For rich text content that needs some HTML
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: protocol
}

/**
 * Validates and sanitizes URL
 * @param url - URL to validate
 * @returns Valid URL or null
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }

    return urlObj.toString();
  } catch {
    return null;
  }
}

/**
 * Validates file upload
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): ValidationResult<File> {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;

  const errors: ValidationError[] = [];

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push({
      field: 'file',
      message: `File size must be less than ${maxSizeMB}MB`,
    });
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: `File type must be one of: ${allowedTypes.join(', ')}`,
    });
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    errors.push({
      field: 'file',
      message: `File extension must be one of: ${allowedExtensions.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: file,
  };
}

/**
 * Validates multiple files
 * @param files - Files to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions & { maxFiles?: number } = {}
): ValidationResult<File[]> {
  const { maxFiles = 5, ...fileOptions } = options;

  const errors: ValidationError[] = [];

  // Check number of files
  if (files.length > maxFiles) {
    errors.push({
      field: 'files',
      message: `Maximum ${maxFiles} files allowed`,
    });
    return { success: false, errors };
  }

  // Validate each file
  const validFiles: File[] = [];
  files.forEach((file, index) => {
    const result = validateFile(file, fileOptions);
    if (result.success && result.data) {
      validFiles.push(result.data);
    } else if (result.errors) {
      result.errors.forEach((err) => {
        errors.push({
          field: `files[${index}]`,
          message: err.message,
        });
      });
    }
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: validFiles,
  };
}
