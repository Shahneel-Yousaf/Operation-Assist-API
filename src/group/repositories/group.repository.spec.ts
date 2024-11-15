import { GetGroupsQuery, GetGroupWebappOrderBy } from '@group/dtos';
import { Group } from '@group/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupArchiveStatus } from '@shared/constants';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { GroupRepository } from './group.repository';

describe('GroupRepository', () => {
  let repository: GroupRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GroupRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<GroupRepository>(GroupRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<Group>);
    const userId = '12133';

    const query: GetGroupsQuery = {
      status: UserGroupArchiveStatus.ARCHIVED,
      orderBys: [],
      limit: 10,
      page: 1,
    };

    const permissionId = 'permissionSAVCGDC8DMP74E';
    const result = await repository.findAll(userId, permissionId, query);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getGroupRelationships', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<Group>);

    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const machineId = 'machine2D3DE0SAVCGDC8DMP74';
    const machineReportId = 'machineReportE0SAVCGDC8DMP';
    const customInspectionFormId = 'customInspectionFormE0SAVC';
    const inspectionId = 'inspectionQWEAXHP4R35R6J0N';

    const result = await repository.getGroupRelationships(
      groupId,
      userId,
      machineId,
      inspectionId,
      machineReportId,
      customInspectionFormId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it.each([
    'groupName',
    'machineCount',
    'reportCount',
    'inspectionFormCount',
    'memberCount',
  ])('getGroupsForWebapp with order by %i', async (field) => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<Group>);

    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const offset = 0;
    const limit = 1;

    const result = await repository.getGroupsForWebapp(userId, offset, limit, {
      field,
      order: 'DESC',
    } as GetGroupWebappOrderBy);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('getGroupsForWebapp success when pass groupIds', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<Group>);

    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const offset = 0;
    const limit = null;
    const orderBy = {
      field: 'groupName',
      order: 'ASC',
    } as GetGroupWebappOrderBy;

    const result = await repository.getGroupsForWebapp(
      userId,
      offset,
      limit,
      orderBy,
      [groupId],
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
