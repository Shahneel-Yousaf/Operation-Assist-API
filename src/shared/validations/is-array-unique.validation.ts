import {
  isArray,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsArrayUnique(
  fieldName?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [fieldName],
      options: {
        message: `${propertyName} must contain unique values${
          fieldName ? ' of field ' + fieldName : ''
        }`,
        ...validationOptions,
      },
      validator: IsArrayUniqueConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsArrayUniqueConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!value) return true;
    if (!isArray(value)) return true;

    const [fieldName] = args.constraints;
    let data = value;

    if (fieldName) {
      data = value.map((item) => item[fieldName]);
    }

    return data.length === [...new Set(data)].length;
  }
}
