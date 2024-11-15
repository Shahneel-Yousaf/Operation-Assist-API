import { CustomInspectionItem } from '@inspection/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { CustomInspectionItemRepository } from '.';

describe('CustomInspectionItemRepository', () => {
  let repository: CustomInspectionItemRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CustomInspectionItemRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<CustomInspectionItemRepository>(
      CustomInspectionItemRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getCustomInspectionItemsInGroup', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<CustomInspectionItem>);
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';

    const result = await repository.getCustomInspectionItemsInGroup(groupId);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
