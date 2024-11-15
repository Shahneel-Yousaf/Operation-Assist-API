import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { PartTypeRepository } from '@template/repositories';

import { PartTypeService } from './part-type.service';

describe('PartTypeService', () => {
  let service: PartTypeService;

  const mockedPartTypeRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        PartTypeService,
        {
          provide: PartTypeRepository,
          useValue: mockedPartTypeRepository,
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PartTypeService>(PartTypeService);
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

  describe('Get list part type', () => {
    it('get list part types success', async () => {
      const mockData = [
        {
          partTypeId: 'PARTTYPE310DGAWYMVZ2EJY2CK',
          partTypeCode: 'CODE',
          isoLocaleCode: 'en',
          partTypeName: 'name',
          partTypeTranslation: {
            partTypeName: 'name',
          },
        },
      ];

      mockedPartTypeRepository.find.mockResolvedValue(mockData);

      expect(await service.getListPartType(ctx)).toEqual(mockData);
    });

    it('mockedReportActionChoiceRepository find error', async () => {
      mockedPartTypeRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListPartType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
