import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];

        throw new BadRequestException({
          statusCode: 400,
          error: 'Validation failed',
          message: firstIssue?.message ?? 'Invalid request data',
        });
      }

      throw error;
    }
  }
}
