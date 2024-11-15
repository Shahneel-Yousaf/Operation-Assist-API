import { transformStringNumber } from '@shared/utils/commons';
import { Transform, TransformFnParams } from 'class-transformer';

export function TransformStringNumber() {
  return Transform(({ value }: TransformFnParams) => {
    return transformStringNumber(value);
  });
}
