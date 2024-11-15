import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ReportActionChoiceRepository } from '@template/repositories';

import { ReportActionChoiceService } from './report-action-choice.service';

describe('ReportActionChoiceService', () => {
  let service: ReportActionChoiceService;

  const mockedReportActionChoiceRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ReportActionChoiceService,
        {
          provide: ReportActionChoiceRepository,
          useValue: mockedReportActionChoiceRepository,
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ReportActionChoiceService>(ReportActionChoiceService);
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

  describe('getMachineReportActionChoices', () => {
    it('get list machine report action choices success', async () => {
      const mockData = [
        {
          reportActionChoiceId: 'report4N1END6NE1V9QCHW8W',
          reportActionChoiceCode: 'CODE',
          isoLocaleCode: 'en',
          reportActionChoiceName: 'name',
          reportActionChoiceTranslation: {
            reportActionChoiceName: 'name',
          },
        },
      ];

      mockedReportActionChoiceRepository.find.mockResolvedValue(mockData);
      expect(await service.getMachineReportActionChoices(ctx)).toEqual(
        mockData,
      );
    });

    it('mockedReportActionChoiceRepository find error', async () => {
      mockedReportActionChoiceRepository.find.mockRejectedValue(new Error());
      try {
        await service.getMachineReportActionChoices(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
