import { Inspection } from '@inspection/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { InspectionRepository } from '.';

describe('InspectionRepository', () => {
  let repository: InspectionRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<InspectionRepository>(InspectionRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getListUserInspectionDraft', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
        orderBy: jest.fn().mockReturnThis(),
      } as unknown as SelectQueryBuilder<Inspection>);
    const machineId = 'machineIdN9Q0KYA36EJ6PR7W7';
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const result = await repository.getListUserInspectionDraft(
      machineId,
      userId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getListInspection', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
      } as unknown as SelectQueryBuilder<Inspection>);
    const machineId = 'machineIdN9Q0KYA36EJ6PR7W7';
    const limit = 1;
    const offset = 0;
    const firstRequestTime = '';
    const result = await repository.getListInspection(
      machineId,
      limit,
      offset,
      firstRequestTime,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getInspectionDetail', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
        orderBy: jest.fn().mockReturnThis(),
      } as unknown as SelectQueryBuilder<Inspection>);
    const machineId = 'machineIdN9Q0KYA36EJ6PR7W7';
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const result = await repository.getInspectionDetail(machineId, userId);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
