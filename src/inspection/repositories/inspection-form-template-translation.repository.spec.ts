import { InspectionFormTemplateTranslation } from '@inspection/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { InspectionFormTemplateTranslationRepository } from '.';

describe('InspectionFormTemplateTranslationRepository', () => {
  let repository: InspectionFormTemplateTranslationRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionFormTemplateTranslationRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<InspectionFormTemplateTranslationRepository>(
      InspectionFormTemplateTranslationRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getInspectionFormTemplateByMachineTypeId', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<InspectionFormTemplateTranslation>);
    const localeCode = ISOLocaleCode.EN;
    const machineTypeId = 'machine2D3DE0SAVCGDC8DMP74E';

    const result = await repository.getInspectionFormTemplateByMachineTypeId(
      localeCode,
      machineTypeId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
