import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { OilTypeRepository } from '@template/repositories/oil-type.repository';

import { OilTypeService } from './oil-type.service';

describe('OilTypeService', () => {
  let service: OilTypeService;

  const mockedOilTypeRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        OilTypeService,
        {
          provide: OilTypeRepository,
          useValue: mockedOilTypeRepository,
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<OilTypeService>(OilTypeService);
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

  describe('Get list oil type', () => {
    it('get list oil types success', async () => {
      const mockData = [
        {
          oilTypeId: 'OILTYPE310DGAWYMVZ2EJY2CKK',
          oilTypeCode: 'CODE',
          isoLocaleCode: 'en',
          oilTypeName: 'name',
          oilTypeTranslation: {
            oilTypeName: 'name',
          },
        },
      ];

      mockedOilTypeRepository.find.mockResolvedValue(mockData);
      expect(await service.getListOilType(ctx)).toEqual(mockData);
    });

    it('mockedReportActionChoiceRepository find error', async () => {
      mockedOilTypeRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListOilType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
