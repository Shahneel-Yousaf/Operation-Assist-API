import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ReportActionChoiceService } from '@template/services/report-action-choice.service';

import { ReportActionChoiceController } from './report-action-choice.controller';

describe('ReportActionChoiceController', () => {
  let controller: ReportActionChoiceController;
  const mockedLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  const mockedReportActionChoiceService = {
    getMachineReportActionChoices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportActionChoiceController],
      providers: [
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: AppLogger,
          useValue: mockedLogger,
        },
        {
          provide: ReportActionChoiceService,
          useValue: mockedReportActionChoiceService,
        },
      ],
    }).compile();

    controller = module.get<ReportActionChoiceController>(
      ReportActionChoiceController,
    );
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get machine report action choices', () => {
    it('should return list report action choices', async () => {
      const returnValues = [
        {
          reportActionChoiceId: 'report4N1END6NE1V9QCHW8W',
          reportActionChoiceCode: 'CODE',
          isoLocaleCode: 'en',
          reportActionChoiceName: 'name',
        },
      ];
      mockedReportActionChoiceService.getMachineReportActionChoices.mockResolvedValue(
        returnValues,
      );
      const groups = await controller.getMachineReportActionChoices(ctx);
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(
        mockedReportActionChoiceService.getMachineReportActionChoices,
      ).toHaveBeenCalledWith(ctx);
    });

    it('should return array of null', async () => {
      mockedReportActionChoiceService.getMachineReportActionChoices.mockResolvedValue(
        [],
      );

      const groups = await controller.getMachineReportActionChoices(ctx);
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when machineService fail', async () => {
      mockedReportActionChoiceService.getMachineReportActionChoices.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getMachineReportActionChoices(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
