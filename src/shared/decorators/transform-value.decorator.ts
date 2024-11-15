import { Transform, TransformFnParams } from 'class-transformer';

export function TransformValue(before: any, after: any) {
  return Transform(({ value }: TransformFnParams) => {
    return value === before ? after : value;
  });
}
