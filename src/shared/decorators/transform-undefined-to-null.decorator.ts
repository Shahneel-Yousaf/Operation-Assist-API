import { Transform, TransformFnParams } from 'class-transformer';

export function TransformUndefinedToNull() {
  return Transform(({ value }: TransformFnParams) => {
    return value ?? null;
  });
}
