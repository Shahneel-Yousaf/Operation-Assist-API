import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function RegexMatches(
  regex: RegExp[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'RegexMatches',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [regex],
      options: {
        message: `${propertyName} is wrong format.`,
        ...validationOptions,
      },
      validator: IsRegexMatchConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsRegexMatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [regex] = args.constraints;
    return regex.every((rg) => rg.test(value));
  }
}
