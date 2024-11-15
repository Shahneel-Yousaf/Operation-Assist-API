import { ValidationArguments } from 'class-validator';

import { IsArrayUniqueConstraint } from './is-array-unique.validation';

describe('IsArrayUniqueConstraint', () => {
  let constraint: IsArrayUniqueConstraint;

  beforeEach(() => {
    constraint = new IsArrayUniqueConstraint();
  });

  it('should return true for an array with unique elements', () => {
    const data = [1, 2, 3, 4];
    const args: ValidationArguments = {
      object: {},
      constraints: [''],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(true);
  });

  it('should return false for an array with non-unique elements', () => {
    const data = [1, 2, 2, 3, 4];
    const args: ValidationArguments = {
      object: {},
      constraints: [''],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(false);
  });

  it('should return true for an array of objects with unique field values', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const args: ValidationArguments = {
      object: {},
      constraints: ['id'],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(true);
  });

  it('should return false for an array of objects with non-unique field values', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }];
    const args: ValidationArguments = {
      object: {},
      constraints: ['id'],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(false);
  });

  it('should return true for an empty array', () => {
    const data: any[] = [];
    const args: ValidationArguments = {
      object: {},
      constraints: [],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(true);
  });

  it('should return true for an array with a single element', () => {
    const data = [1];
    const args: ValidationArguments = {
      object: {},
      constraints: [],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(true);
  });

  it('should return false for value undefine', () => {
    const data = undefined;
    const args: ValidationArguments = {
      object: {},
      constraints: [],
      property: 'arrayProperty',
      targetName: 'target',
      value: data,
    };

    const isValid = constraint.validate(data, args);
    expect(isValid).toBe(true);
  });
});
