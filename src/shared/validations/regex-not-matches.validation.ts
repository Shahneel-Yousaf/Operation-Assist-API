import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function RegexNotMatches(
  regex: Record<string, any>[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'RegexNotMatches',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [regex],
      options: {
        message: `${propertyName} is wrong format.`,
        ...validationOptions,
      },
      validator: IsRegexNotMatchConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsRegexNotMatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [regex] = args.constraints;
    for (const rg of regex) {
      if (rg.regex.test(value)) {
        if (rg.customValidateKey) {
          throw new BadRequestException({
            customValidateKey: rg.customValidateKey,
          });
        }
        return false;
      }
    }
    return true;
  }
}
