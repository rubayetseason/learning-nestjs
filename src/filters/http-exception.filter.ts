import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string | string[];
  source: string;
  timestamp: string;
  path: string;
  method: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('🔥 RAW EXCEPTION:', exception);

    const source =
      exception instanceof Error ? extractSource(exception.stack) : '';

    /**
     * ----------------------------------------------------
     * Mongo duplicate key error
     * ----------------------------------------------------
     */
    if (hasMongoDuplicateKey(exception) && exception.code === 11000) {
      return this.send(response, {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'BadRequest',
        message: 'Duplicate value error',
        source,
        request,
      });
    }

    /**
     * ----------------------------------------------------
     * Non-HTTP runtime errors
     * ----------------------------------------------------
     */
    if (!(exception instanceof HttpException)) {
      const message =
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : hasMessage(exception)
            ? exception.message
            : 'Unknown error';

      return this.send(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error',
        message,
        source,
        request,
      });
    }

    /**
     * ----------------------------------------------------
     * HTTP exceptions (Zod, BadRequest, etc.)
     * ----------------------------------------------------
     */
    const statusCode = exception.getStatus();
    const normalized = normalizeHttpResponse(exception.getResponse());

    return this.send(response, {
      statusCode,
      error: normalized.error ?? exception.name.replace('Exception', ''),
      message: normalized.message,
      source,
      request,
    });
  }

  private send(
    response: Response,
    args: {
      statusCode: number;
      error: string;
      message: string | string[];
      source: string;
      request: Request;
    },
  ) {
    const body: ErrorResponse = {
      statusCode: args.statusCode,
      error: args.error,
      message: args.message,
      source: args.source,
      timestamp: new Date().toISOString(),
      path: args.request.url,
      method: args.request.method,
    };

    return response.status(args.statusCode).json(body);
  }
}

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                     */
/* -------------------------------------------------------------------------- */

function extractSource(stack?: string): string {
  if (!stack) return '';

  const line = stack
    .split('\n')
    .find((l) => l.includes('.ts') || l.includes('.js'));

  return line?.trim() ?? '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasMongoDuplicateKey(error: unknown): error is { code: number } {
  return isRecord(error) && typeof error.code === 'number';
}

function hasMessage(error: unknown): error is { message: string } {
  return isRecord(error) && typeof error.message === 'string';
}

function normalizeHttpResponse(response: unknown): {
  message: string | string[];
  error?: string;
} {
  if (typeof response === 'string') {
    return { message: response };
  }

  if (isRecord(response)) {
    const message =
      typeof response.message === 'string' || Array.isArray(response.message)
        ? response.message
        : 'Bad request';

    const error =
      typeof response.error === 'string' ? response.error : undefined;

    return { message, error };
  }

  return { message: 'Bad request' };
}
