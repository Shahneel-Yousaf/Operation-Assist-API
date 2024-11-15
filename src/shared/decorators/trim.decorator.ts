import { Transform, TransformFnParams } from 'class-transformer';
import { isString } from 'class-validator';

export function TrimString() {
  return Transform(({ value }: TransformFnParams) => {
    return isString(value) ? value.trim() : value;
  });
}
