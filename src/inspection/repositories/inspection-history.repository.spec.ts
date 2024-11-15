import { InspectionHistory } from '@inspection/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { InspectionHistoryRepository } from '.';

describe('InspectionHistoryRepository', () => {
  let repository: InspectionHistoryRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionHistoryRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<InspectionHistoryRepository>(
      InspectionHistoryRepository,
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
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<InspectionHistory>);
    const machineId = 'inspec2D3DE0SAVCGDC8DMP74E';
    const limit = 1;

    repository.getInspectionHistoriesQuery(machineId, limit);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
  });
});
