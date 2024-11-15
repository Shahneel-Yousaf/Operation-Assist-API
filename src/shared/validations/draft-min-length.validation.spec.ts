import { CustomInspectionFormCurrentStatus } from '@shared/constants';

import { CustomMinLengthValidator } from '.';

describe('CustomMinLengthValidator', () => {
  let customLengthValidator: CustomMinLengthValidator;

  beforeEach(() => {
    customLengthValidator = new CustomMinLengthValidator();
  });

  it('should allow empty field in Draft status', () => {
    const value = '';
    const args: any = {
      constraints: [1],
      object: { currentStatus: CustomInspectionFormCurrentStatus.DRAFT },
    };

    const result = customLengthValidator.validate(value, args);

    expect(result).toBe(true);
  });

  it('should validate length within the specified range', () => {
    const value = 'example';
    const args: any = {
      constraints: [1],
      object: { currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED },
    };

    const result = customLengthValidator.validate(value, args);

    expect(result).toBe(true);
  });

  it('should return a custom error message for Draft status', () => {
    const args: any = {
      constraints: [1],
      object: { currentStatus: CustomInspectionFormCurrentStatus.DRAFT },
    };

    const errorMessage = customLengthValidator.defaultMessage(args);

    expect(errorMessage).toBe('Length must be greater than 1 characters');
  });
});
