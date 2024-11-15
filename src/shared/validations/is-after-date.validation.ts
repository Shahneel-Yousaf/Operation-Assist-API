import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsAfterDate(
  dateCompareName?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [dateCompareName],
      options: {
        message: `${propertyName} must be after ${dateCompareName} `,
        ...validationOptions,
      },
      validator: IsAfterDateConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsAfterDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [dateCompareName] = args.constraints;
    if (!args.object[dateCompareName] || !value) return true;
    return dayjs(value).isAfter(dayjs(args.object[dateCompareName]));
  }
}
