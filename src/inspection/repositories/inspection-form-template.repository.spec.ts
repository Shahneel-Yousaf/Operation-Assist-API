import { InspectionFormTemplate } from '@inspection/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { InspectionFormTemplateRepository } from '.';

describe('InspectionFormTemplateRepository', () => {
  let repository: InspectionFormTemplateRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionFormTemplateRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<InspectionFormTemplateRepository>(
      InspectionFormTemplateRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getInspectionItemTemplates', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<InspectionFormTemplate>);
    const localeCode = ISOLocaleCode.EN;
    const inspectionFormTemplateId = 'inspec2D3DE0SAVCGDC8DMP74E';

    const result = await repository.getInspectionItemTemplates(
      localeCode,
      inspectionFormTemplateId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
