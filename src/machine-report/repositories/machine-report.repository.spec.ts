import { InspectionRepository } from '@inspection/repositories';
import { GetMachineReportsForWebappOrderBy } from '@machine-report/dtos';
import { MachineReport } from '@machine-report/entities';
import { Test, TestingModule } from '@nestjs/testing';
import {
  dateFormat,
  ISOLocaleCode,
  MachineReportResponseStatus,
  MachineReportSortByField,
  MachineSummaryType,
  Order,
} from '@shared/constants';
import * as dayjs from 'dayjs';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { MachineReportRepository } from './machine-report.repository';

const mockedInspectionRepository = {
  getInspectionReportQuery: jest.fn(),
  getInspectionReportCountQuery: jest.fn(),
};

const mockedMachineReportRepository = {
  getIncidentReportQuery: jest.fn(),
  getMachineOperationReportQuery: jest.fn(),
  getFuelMaintenanceReportQuery: jest.fn(),
  getIncidentReportCountQuery: jest.fn(),
  getMachineOperationReportCountQuery: jest.fn(),
  getFuelMaintenanceReportCountQuery: jest.fn(),
};

describe('MachineReportRepository', () => {
  let repository: MachineReportRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MachineReportRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
        {
          provide: InspectionRepository,
          useValue: mockedInspectionRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<MachineReportRepository>(
      MachineReportRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getListMachineReport', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<MachineReport>);

    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const machineId = 'machine2D3DE0SAVCGDC8DMP74';
    const limit = 3;
    const offset = 0;
    const firstRequestTime = dayjs().format(dateFormat.dateTimeFormat);

    const result = await repository.getListMachineReport(
      machineId,
      userId,
      limit,
      offset,
      firstRequestTime,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getListMachineReport', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<MachineReport>);

    const machineId = 'machine2D3DE0SAVCGDC8DMP74';
    const limit = 3;
    const offset = 0;
    const isoLocaleCode = ISOLocaleCode.EN;
    const responseStatus = MachineReportResponseStatus.RESOLVED;
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const orderBys: GetMachineReportsForWebappOrderBy[] = [
      {
        field: MachineReportSortByField.REPORTED_AT,
        order: Order.DESC,
      },
    ];

    const result = await repository.getListMachineReportForWebapp(
      machineId,
      limit,
      offset,
      isoLocaleCode,
      responseStatus,
      orderBys,
      userId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getMachineReportInfo', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<MachineReport>);

    const machineReportId = 'machine2D3DE0SAVCGDC8DMP74';
    const isoLocaleCode = ISOLocaleCode.EN;
    const userId = 'userYE1S2NCG2HXHP4R35R6J0N';

    const result = await repository.getMachineReportInfo(
      machineReportId,
      userId,
      isoLocaleCode,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getIncidentReportQuery', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnThis(),
      } as unknown as SelectQueryBuilder<MachineReport>);
    const machineId = 'machine2D3DE0SAVCGDC8DMP74';
    const limit = 0;
    const offset = 0;
    const statTime = dayjs().format('YYYY-MM-DD');
    const endTime = dayjs().format('YYYY-MM-DD');
    const reportTypeTitle = {
      inspection: {},
    };
    const fuelTitle = {
      fuel: {},
      oil: {},
      part: {},
    };
    const orderBys = [
      {
        field: 'reporterName',
        order: Order.DESC,
      },
    ];
    const filter = MachineSummaryType.INSPECTION;
    const filterBy = {
      statTime,
      endTime,
      limit,
      offset,
      reportTypeTitle,
      fuelTitle,
      orderBys,
      filter,
    };

    mockedInspectionRepository.getInspectionReportQuery.mockReturnValue(
      'query',
    );

    mockedMachineReportRepository.getIncidentReportQuery.mockReturnValue(
      'query',
    );

    mockedMachineReportRepository.getMachineOperationReportQuery.mockReturnValue(
      'query',
    );

    mockedMachineReportRepository.getFuelMaintenanceReportQuery.mockReturnValue(
      'query',
    );

    jest.spyOn(repository, 'query').mockResolvedValue([]);
    const result = await repository.getListMachineSummary(machineId, filterBy);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('countReportSummary', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnThis(),
      } as unknown as SelectQueryBuilder<MachineReport>);
    const machineId = 'machine2D3DE0SAVCGDC8DMP74';
    const statTime = dayjs().format('YYYY-MM-DD');
    const endTime = dayjs().format('YYYY-MM-DD');
    const reportTypeTitle = {
      inspection: {},
    };
    const orderBys = [
      {
        field: 'reporterName',
        order: Order.DESC,
      },
    ];
    const filter = MachineSummaryType.INSPECTION;
    const filterBy = {
      statTime,
      endTime,
      reportTypeTitle,
      orderBys,
      filter,
    };

    mockedInspectionRepository.getInspectionReportCountQuery.mockReturnValue(
      'query',
    );

    mockedMachineReportRepository.getIncidentReportCountQuery.mockReturnValue(
      'query',
    );

    mockedMachineReportRepository.getMachineOperationReportCountQuery.mockReturnValue(
      'query',
    );

    mockedMachineReportRepository.getFuelMaintenanceReportCountQuery.mockReturnValue(
      'query',
    );

    jest.spyOn(repository, 'query').mockResolvedValue([]);
    const result = await repository.countReportSummary(machineId, filterBy);

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('getMaintenanceReportDetail', async () => {
    const createQueryBuilderSpy = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce([]),
      } as unknown as SelectQueryBuilder<MachineReport>);

    const machineReportId = 'machine2D3DE0SAVCGDC8DMP74';

    const isoLocaleCode = ISOLocaleCode.EN;
    const result = await repository.getMaintenanceReportDetail(
      isoLocaleCode,
      machineReportId,
    );

    expect(createQueryBuilderSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
