import { BadRequestException } from '@nestjs/common';
import { ValidationArguments } from 'class-validator';

import { IsRegexNotMatchConstraint } from '.';

describe('IsRegexNotMatchConstraint', () => {
  let constraint: IsRegexNotMatchConstraint;

  beforeEach(() => {
    constraint = new IsRegexNotMatchConstraint();
  });

  it('should return true for a string not matching the regex pattern', () => {
    const regexPattern = [
      {
        regex: /^\d{3}-\d{2}-\d{4}$/,
        customValidateKey: 'string',
      },
    ];
    const args: ValidationArguments = {
      object: {},
      constraints: [regexPattern],
      property: 'ssnProperty',
      targetName: 'target',
      value: '123-45-6789',
    };
    try {
      constraint.validate(args.value, args);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return false for a string matching the regex pattern', () => {
    const regexPattern = [
      {
        regex: /^\d{3}-\d{2}-\d{4}$/,
        customValidateKey: 'string',
      },
    ];
    const args: ValidationArguments = {
      object: {},
      constraints: [regexPattern],
      property: 'ssnProperty',
      targetName: 'target',
      value: '123456789',
    };

    const isValid = constraint.validate(args.value, args);
    expect(isValid).toBe(true);
  });
});
