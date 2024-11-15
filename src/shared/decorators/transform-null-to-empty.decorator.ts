import { Transform, TransformFnParams } from 'class-transformer';

export function TransformNullToEmpty() {
  return Transform(({ value }: TransformFnParams) => {
    return value === null ? '' : value;
  });
}
