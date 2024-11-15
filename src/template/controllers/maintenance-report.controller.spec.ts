import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { MaintenanceReportService } from '@template/services/maintenance-report.service';

import { MaintenanceReportController } from './maintenance-report.controller';

describe('MaintenanceReportController', () => {
  let controller: MaintenanceReportController;

  const mockMaintenanceReportService = {
    getMaintenanceReportTemplate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceReportController],
      providers: [
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
        {
          provide: MaintenanceReportService,
          useValue: mockMaintenanceReportService,
        },
      ],
    }).compile();

    controller = module.get<MaintenanceReportController>(
      MaintenanceReportController,
    );
  });

  const ctx = new RequestContext();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get maintenance report templates', () => {
    it('should return maintenance report templates', async () => {
      const mockMaintenanceReportTemplateOutPut = {
        regularMaintenanceItemChoiceTemplates: [
          {
            regularMaintenanceItemChoiceId: 'REGULARE0PGPY69G9DQWFWZXRA',
            regularMaintenanceItemChoiceCode: '500HOURS',
            position: 12,
            isoLocaleCode: 'en',
            regularMaintenanceItemChoiceName: 'name',
          },
        ],
        irregularMaintenanceItemChoiceTemplates: [
          {
            irregularMaintenanceItemChoiceId: 'IRREGULAR7C2QRW4DJDEXDADTH',
            irregularMaintenanceItemChoiceCode: 'CLEAN_AIRCLEANER',
            position: 12,
            isoLocaleCode: 'en',
            irregularMaintenanceItemChoiceName: 'name',
          },
        ],
        maintenanceReasonChoiceTemplates: [
          {
            maintenanceReasonChoiceId: 'REASONR0SRN77DMJYBME112F2W',
            isPeriodSelection: false,
            maintenanceReasonChoiceCode: 'PERIOD_ELAPSE',
            isoLocaleCode: 'en',
            maintenanceReasonChoiceName: 'name',
          },
        ],
        maintenanceReasonPeriodChoiceTemplates: [
          {
            maintenanceReasonPeriodChoiceId: 'PERIOD4FV732Q2GM4SF92JMEBR',
            maintenanceReasonPeriodChoiceCode: 'PERIOD_6M',
            isoLocaleCode: 'en',
            maintenanceReasonPeriodChoiceName: 'name',
          },
        ],
      };
      mockMaintenanceReportService.getMaintenanceReportTemplate.mockResolvedValue(
        mockMaintenanceReportTemplateOutPut,
      );
      const maintenanceReportTemplate =
        await controller.getMaintenanceReportTemplate(ctx);

      expect(maintenanceReportTemplate).toEqual({
        data: mockMaintenanceReportTemplateOutPut,
        meta: {},
      });
      expect(
        mockMaintenanceReportService.getMaintenanceReportTemplate,
      ).toHaveBeenCalledWith(ctx);
    });

    it('should throw error when MaintenanceReportService fail', async () => {
      mockMaintenanceReportService.getMaintenanceReportTemplate.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getMaintenanceReportTemplate(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
