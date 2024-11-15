import { GetMachineInGroupWebappOrderBy } from '@group/dtos';
import { Machine } from '@machine/entities';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GroupMachineCondition,
  ISOLocaleCode,
  MachineSortByField,
} from '@shared/constants';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { MachineRepository } from './machine.repository';

describe('MachineRepository', () => {
  let repository: MachineRepository;

  const mockDataSource = {
    createEntityManager: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MachineRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<MachineRepository>(MachineRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('groupMachineSuggestions', async () => {
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const search = undefined;
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const limit = 10;

    jest.spyOn(repository, 'groupMachineSuggestionSubQuery').mockReturnThis();

    const result = await repository.groupMachineSuggestions(
      userId,
      search,
      groupId,
      limit,
    );

    expect(result).toEqual([]);
  });

  it('groupMachineSuggestions by search', async () => {
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const search = 'machine name';
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const limit = 10;

    jest.spyOn(repository, 'groupMachineSuggestionSubQuery').mockReturnThis();

    const result = await repository.groupMachineSuggestions(
      userId,
      search,
      groupId,
      limit,
    );

    expect(result).toEqual([]);
  });

  it('getMachinesInGroup', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<Machine>);
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';

    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const isoLocaleCode = ISOLocaleCode.JA;
    const result = await repository.getMachinesInGroup(
      userId,
      groupId,
      isoLocaleCode,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getMachinesInGroup', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<Machine>);
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';

    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const isoLocaleCode = ISOLocaleCode.JA;
    const result = await repository.getMachinesInGroup(
      userId,
      groupId,
      isoLocaleCode,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getMachinesInGroupForWebapp', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
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
      } as unknown as SelectQueryBuilder<Machine>);

    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const isoLocaleCode = ISOLocaleCode.EN;
    const offset = 1;
    const limit = 1;
    const orderBys = [
      {
        field: MachineSortByField.MACHINE_MANUFACTURER_NAME,
        order: 'ASC',
      } as unknown as GetMachineInGroupWebappOrderBy,
    ];
    const machineCondition = GroupMachineCondition.NORMAL;
    const result = await repository.getMachinesInGroupForWebapp(
      groupId,
      isoLocaleCode,
      offset,
      limit,
      orderBys,
      machineCondition,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getMachinesInGroupForWebapp', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
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
      } as unknown as SelectQueryBuilder<Machine>);

    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const isoLocaleCode = ISOLocaleCode.EN;
    const offset = 1;
    const limit = 1;
    const orderBys = [
      {
        field: MachineSortByField.MACHINE_TYPE,
        order: 'ASC',
      } as unknown as GetMachineInGroupWebappOrderBy,
    ];
    const machineCondition = GroupMachineCondition.NORMAL;
    const result = await repository.getMachinesInGroupForWebapp(
      groupId,
      isoLocaleCode,
      offset,
      limit,
      orderBys,
      machineCondition,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getMachinesInGroupForWebapp', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
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
      } as unknown as SelectQueryBuilder<Machine>);

    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    const isoLocaleCode = ISOLocaleCode.EN;
    const offset = 1;
    const limit = 1;
    const orderBys = [
      {
        field: '',
        order: 'ASC',
      } as unknown as GetMachineInGroupWebappOrderBy,
    ];
    const machineCondition = GroupMachineCondition.NORMAL;
    const result = await repository.getMachinesInGroupForWebapp(
      groupId,
      isoLocaleCode,
      offset,
      limit,
      orderBys,
      machineCondition,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('countMachinesInGroupForWebapp', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValueOnce(1),
      } as unknown as SelectQueryBuilder<Machine>);

    const machineCondition = GroupMachineCondition.NORMAL;
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';

    const result = await repository.countMachinesInGroupForWebapp(
      machineCondition,
      groupId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual(1);
  });
});
