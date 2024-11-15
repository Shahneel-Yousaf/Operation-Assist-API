import {
  CustomInspectionFormHistoryRepository,
  CustomInspectionItemHistoryRepository,
  InspectionHistoryRepository,
  InspectionResultHistoryRepository,
} from '@inspection/repositories';
import { MachineReportHistory } from '@machine-report/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { dateFormat, Version } from '@shared/constants';
import * as dayjs from 'dayjs';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { MachineReportHistoryRepository } from './machine-report-history.repository';

const mockedInspectionResultHistoryRepo = {
  createQueryBuilder: jest.fn(),
};

const mockedCustomInspectionItemHistoryRepo = {
  createQueryBuilder: jest.fn(),
};

const mockedInspectionHistoryRepository = {
  getInspectionHistoriesQuery: jest.fn(),
};

const mockedCustomInspectionFormHistoryRepository = {
  getCustomInspectionFormHistoriesQuery: jest.fn(),
};

describe('MachineReportHistoryRepository', () => {
  let repository: MachineReportHistoryRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MachineReportHistoryRepository,
        {
          provide: InspectionResultHistoryRepository,
          useValue: mockedInspectionResultHistoryRepo,
        },
        {
          provide: CustomInspectionItemHistoryRepository,
          useValue: mockedCustomInspectionItemHistoryRepo,
        },
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
        {
          provide: InspectionHistoryRepository,
          useValue: mockedInspectionHistoryRepository,
        },
        {
          provide: CustomInspectionFormHistoryRepository,
          useValue: mockedCustomInspectionFormHistoryRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<MachineReportHistoryRepository>(
      MachineReportHistoryRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('getListMachineHistories', async () => {
    const machineReportHistoryQuery = jest
      .spyOn(repository, 'createQueryBuilder')
      .mockReturnValue({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnThis(),
      } as unknown as SelectQueryBuilder<MachineReportHistory>);

    mockedInspectionHistoryRepository.getInspectionHistoriesQuery.mockReturnValue(
      'query',
    );

    mockedCustomInspectionFormHistoryRepository.getCustomInspectionFormHistoriesQuery.mockReturnValue(
      'query',
    );

    jest.spyOn(repository, 'query').mockResolvedValue([]);

    const machineId = 'machine2D3DE0SAVCGDC8DMP74';
    const limit = 3;
    const offset = 0;
    const firstRequestTime = dayjs().format(dateFormat.dateTimeFormat);

    const result = await repository.getListMachineHistories(
      machineId,
      limit,
      offset,
      firstRequestTime,
      Version.V1,
    );

    expect(machineReportHistoryQuery).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
