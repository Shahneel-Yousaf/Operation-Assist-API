import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  IrregularMaintenanceItemChoiceRepository,
  MaintenanceReasonChoiceRepository,
  MaintenanceReasonPeriodChoiceRepository,
  RegularMaintenanceItemChoiceRepository,
} from '@template/repositories';

import { MaintenanceReportService } from './maintenance-report.service';

describe('MaintenanceReportService', () => {
  let service: MaintenanceReportService;

  const mockedRegularMaintenanceItemChoiceRepo = {
    find: jest.fn(),
  };

  const mockedIrregularMaintenanceItemChoiceRepo = {
    find: jest.fn(),
  };

  const mockedMaintenanceReasonChoiceRepo = {
    find: jest.fn(),
  };

  const mockedMaintenanceReasonPeriodChoiceRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        MaintenanceReportService,
        {
          provide: RegularMaintenanceItemChoiceRepository,
          useValue: mockedRegularMaintenanceItemChoiceRepo,
        },
        {
          provide: IrregularMaintenanceItemChoiceRepository,
          useValue: mockedIrregularMaintenanceItemChoiceRepo,
        },
        {
          provide: MaintenanceReasonChoiceRepository,
          useValue: mockedMaintenanceReasonChoiceRepo,
        },
        {
          provide: MaintenanceReasonPeriodChoiceRepository,
          useValue: mockedMaintenanceReasonPeriodChoiceRepo,
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MaintenanceReportService>(MaintenanceReportService);
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;
  ctx.isoLocaleCode = ISOLocaleCode.EN;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get maintenance report templates', () => {
    it('get maintenance report templates success', async () => {
      const mockRegularMaintenanceItemChoiceData = [
        {
          regularMaintenanceItemChoiceId: '01J1VPYE0PGPY69G9DQWFWZXRA',
          regularMaintenanceItemChoiceCode: 'code',
          position: 12,
          isoLocaleCode: 'en',
          regularMaintenanceItemChoiceName: 'name',
          regularMaintenanceItemChoiceTranslation: {
            regularMaintenanceItemChoiceName: 'name',
          },
        },
      ];
      const mockIrregularMaintenanceItemChoiceData = [
        {
          irregularMaintenanceItemChoiceId: '01J1VPYE0PGPY69G9DQWFWZXRA',
          irregularMaintenanceItemChoiceCode: 'code',
          position: 12,
          isoLocaleCode: 'en',
          irregularMaintenanceItemChoiceName: 'name',
          irregularMaintenanceItemChoiceTranslation: {
            irregularMaintenanceItemChoiceName: 'name',
          },
        },
      ];
      const mockMaintenanceReasonChoiceData = [
        {
          maintenanceReasonChoiceId: '01J1VEW967C2QRW4DJDEXDADTH',
          maintenanceReasonChoiceCode: 'code',
          isPeriodSelection: false,
          position: 12,
          isoLocaleCode: 'en',
          maintenanceReasonChoiceName: 'name',
          maintenanceReasonChoiceTranslation: {
            maintenanceReasonChoiceName: 'name',
          },
        },
      ];
      const mockMaintenanceReasonPeriodChoiceData = [
        {
          maintenanceReasonPeriodChoiceId: '01J1VPYE0PGPY69G9DQWFWZXRA',
          maintenanceReasonPeriodChoiceCode: 'code',
          position: 12,
          isoLocaleCode: 'en',
          maintenanceReasonPeriodChoiceName: 'name',
          maintenanceReasonPeriodChoiceTranslation: {
            maintenanceReasonPeriodChoiceName: 'name',
          },
        },
      ];

      mockedRegularMaintenanceItemChoiceRepo.find.mockResolvedValue(
        mockRegularMaintenanceItemChoiceData,
      );
      mockedIrregularMaintenanceItemChoiceRepo.find.mockResolvedValue(
        mockIrregularMaintenanceItemChoiceData,
      );
      mockedMaintenanceReasonChoiceRepo.find.mockResolvedValue(
        mockMaintenanceReasonChoiceData,
      );
      mockedMaintenanceReasonPeriodChoiceRepo.find.mockResolvedValue(
        mockMaintenanceReasonPeriodChoiceData,
      );
      const mockResponse = {
        meta: {},
        data: {
          regularMaintenanceItemChoiceTemplates:
            mockRegularMaintenanceItemChoiceData,
          irregularMaintenanceItemChoiceTemplates:
            mockIrregularMaintenanceItemChoiceData,
          maintenanceReasonChoiceTemplates: mockMaintenanceReasonChoiceData,
          maintenanceReasonPeriodChoiceTemplates:
            mockMaintenanceReasonPeriodChoiceData,
        },
      };

      expect(await service.getMaintenanceReportTemplate(ctx)).toEqual(
        mockResponse.data,
      );
    });

    it('mockedRegularMaintenanceItemChoiceRepository find error', async () => {
      mockedRegularMaintenanceItemChoiceRepo.find.mockRejectedValue(
        new Error(),
      );
      try {
        await service.getMaintenanceReportTemplate(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
