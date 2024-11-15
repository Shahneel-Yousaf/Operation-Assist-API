import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsDateFormatString(
  dateFormat: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDateFormatString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [dateFormat],
      options: {
        message: `${propertyName} must match the following format: ${dateFormat.toString()}`,
        ...validationOptions,
      },
      validator: IsDateFormatStringConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsDateFormatStringConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments) {
    const [dateFormat] = args.constraints;
    return dateFormat.some(
      (format) => dayjs(value, format).format(format) === value,
    );
  }
}
