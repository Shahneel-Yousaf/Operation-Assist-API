import { ValidationArguments } from 'class-validator';

import { IsAfterDateConstraint } from './is-after-date.validation';

describe('IsAfterDateConstraint', () => {
  let constraint: IsAfterDateConstraint;

  beforeEach(() => {
    constraint = new IsAfterDateConstraint();
  });

  it('should return true if date is after the compared date', () => {
    const value = '2023-10-20';
    const dateCompareName = 'compareDate';
    const args: ValidationArguments = {
      object: {
        [dateCompareName]: '2023-10-19',
      },
      constraints: [dateCompareName],
      property: 'dateProperty',
      targetName: 'target',
      value,
    };

    const isValid = constraint.validate(value, args);
    expect(isValid).toBe(true);
  });

  it('should return false if date is equal to the compared date', () => {
    const value = '2023-10-20';
    const dateCompareName = 'compareDate';
    const args: ValidationArguments = {
      object: {
        [dateCompareName]: value,
      },
      constraints: [dateCompareName],
      property: 'dateProperty',
      targetName: 'target',
      value,
    };

    const isValid = constraint.validate(value, args);
    expect(isValid).toBe(false);
  });

  it('should return false if date is before to the compared date', () => {
    const value = '2023-10-20';
    const dateCompareName = 'compareDate';
    const args: ValidationArguments = {
      object: {
        [dateCompareName]: '2023-10-21',
      },
      constraints: [dateCompareName],
      property: 'dateProperty',
      targetName: 'target',
      value,
    };

    const isValid = constraint.validate(value, args);
    expect(isValid).toBe(false);
  });

  it('should return true if compared date is not provided', () => {
    const value = '2023-10-20';
    const dateCompareName = 'compareDate';
    const args: ValidationArguments = {
      object: {},
      constraints: [dateCompareName],
      property: 'dateProperty',
      targetName: 'target',
      value,
    };

    const isValid = constraint.validate(value, args);
    expect(isValid).toBe(true);
  });

  it('should return true if input date is not provided', () => {
    const value = undefined;
    const dateCompareName = 'compareDate';
    const args: ValidationArguments = {
      object: {
        [dateCompareName]: '2023-10-20',
      },
      constraints: [dateCompareName],
      property: 'dateProperty',
      targetName: 'target',
      value,
    };

    const isValid = constraint.validate(value, args);
    expect(isValid).toBe(true);
  });
});
