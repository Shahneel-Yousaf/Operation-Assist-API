import { GetGroupInspectionFormOrderBy } from '@group/dtos';
import { CustomInspectionForm } from '@inspection/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomInspectionFormCurrentStatus } from '@shared/constants';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { CustomInspectionFormRepository } from '.';

describe('CustomInspectionFormRepository', () => {
  let repository: CustomInspectionFormRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CustomInspectionFormRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<CustomInspectionFormRepository>(
      CustomInspectionFormRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getInspectionFormsInGroup', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<CustomInspectionForm>);
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';

    const result = await repository.getInspectionFormsInGroup(groupId);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getInspectionItems', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<CustomInspectionForm>);
    const customInspectionFormId = 'inspec2D3DE0SAVCGDC8DMP74E';

    const result = await repository.getInspectionItems(customInspectionFormId);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('countGroupInspectionForms', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValueOnce(1),
      } as unknown as SelectQueryBuilder<CustomInspectionForm>);

    const userId = 'userDE2D3DE0SAVCGDC8DMP74E';
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const currentStatus = CustomInspectionFormCurrentStatus.PUBLISHED;
    const result = await repository.countGroupInspectionForms(
      groupId,
      userId,
      currentStatus,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual(1);
  });

  it('getGroupInspectionForms', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<CustomInspectionForm>);

    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const userId = 'userDE2D3DE0SAVCGDC8DMP74E';
    const offset = 1;
    const limit = 1;
    const orderBys = [
      {
        field: '',
        order: 'ASC',
      } as unknown as GetGroupInspectionFormOrderBy,
    ];
    const currentStatus = CustomInspectionFormCurrentStatus.PUBLISHED;
    const result = await repository.getGroupInspectionForms(
      groupId,
      userId,
      orderBys,
      limit,
      offset,
      currentStatus,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
