import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomUppercasePipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  }
}
