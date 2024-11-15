import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { OilTypeService } from '@template/services/oil-type.service';

import { OilTypeController } from './oil-type.controller';

describe('OilTypeController', () => {
  let controller: OilTypeController;

  const mockOilTypeService = {
    getListOilType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OilTypeController],
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
          provide: OilTypeService,
          useValue: mockOilTypeService,
        },
      ],
    }).compile();

    controller = module.get<OilTypeController>(OilTypeController);
  });

  const ctx = new RequestContext();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get list oil type', () => {
    it('should return list oil types', async () => {
      const mockOilTypeOutPut = [
        {
          oilTypeId: 'OILTYPE310DGAWYMVZ2EJY2CKK',
          oilTypeCode: 'CODE',
          isoLocaleCode: 'en',
          oilTypeName: 'name',
        },
      ];
      mockOilTypeService.getListOilType.mockResolvedValue(mockOilTypeOutPut);
      const oilTypes = await controller.getListOilType(ctx);

      expect(oilTypes).toEqual({
        data: mockOilTypeOutPut,
        meta: {},
      });
      expect(mockOilTypeService.getListOilType).toHaveBeenCalledWith(ctx);
    });

    it('should throw error when OilTypeService fail', async () => {
      mockOilTypeService.getListOilType.mockRejectedValue(new Error());

      try {
        await controller.getListOilType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
