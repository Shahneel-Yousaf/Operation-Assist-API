import { ValidationArguments } from 'class-validator';

import { IsRegexMatchConstraint } from './regex-matches';

describe('IsRegexMatchConstraint', () => {
  let constraint: IsRegexMatchConstraint;

  beforeEach(() => {
    constraint = new IsRegexMatchConstraint();
  });

  it('should return true for a string matching the regex pattern', () => {
    const regexPattern = [/^\d{3}-\d{2}-\d{4}$/];
    const args: ValidationArguments = {
      object: {},
      constraints: [regexPattern],
      property: 'ssnProperty',
      targetName: 'target',
      value: '123-45-6789',
    };

    const isValid = constraint.validate(args.value, args);
    expect(isValid).toBe(true);
  });

  it('should return false for a string not matching the regex pattern', () => {
    const regexPattern = [/^\d{3}-\d{2}-\d{4}$/];
    const args: ValidationArguments = {
      object: {},
      constraints: [regexPattern],
      property: 'ssnProperty',
      targetName: 'target',
      value: '123456789',
    };

    const isValid = constraint.validate(args.value, args);
    expect(isValid).toBe(false);
  });
});
