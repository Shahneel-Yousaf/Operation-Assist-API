import { ValidationArguments } from 'class-validator';

import { IsDateFormatStringConstraint } from './is-date-format-string.validation';

describe('IsDateFormatStringConstraint', () => {
  let constraint: IsDateFormatStringConstraint;

  beforeEach(() => {
    constraint = new IsDateFormatStringConstraint();
  });

  it('should return true for valid date formats', () => {
    const validFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
    const args: ValidationArguments = {
      object: {},
      constraints: [validFormats],
      property: 'dateProperty',
      targetName: 'target',
      value: '2023-10-23',
    };

    const isValid = constraint.validate(args.value, args);
    expect(isValid).toBe(true);
  });

  it('should return false for invalid date formats', () => {
    const validFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
    const args: ValidationArguments = {
      object: {},
      constraints: [validFormats],
      property: 'dateProperty',
      targetName: 'target',
      value: '23-10-2023',
    };

    const isValid = constraint.validate(args.value, args);
    expect(isValid).toBe(false);
  });
});
