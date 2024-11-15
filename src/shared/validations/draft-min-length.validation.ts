import { CustomInspectionFormCurrentStatus } from '@shared/constants';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function DraftMinLengthValidator(
  minLength?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DraftLengthValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minLength],
      options: {
        ...validationOptions,
      },
      validator: CustomMinLengthValidator,
    });
  };
}

@ValidatorConstraint({ name: 'CustomMinLengthValidator', async: false })
export class CustomMinLengthValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [min] = args.constraints;
    const currentStatus = args.object['currentStatus'];

    if (currentStatus === CustomInspectionFormCurrentStatus.DRAFT) {
      return true;
    }

    return value?.length >= min;
  }

  defaultMessage(args: ValidationArguments) {
    const min = args.constraints;
    return `Length must be greater than ${min} characters`;
  }
}
