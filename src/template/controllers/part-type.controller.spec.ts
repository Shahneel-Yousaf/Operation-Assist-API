import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { PartTypeService } from '@template/services/part-type.service';

import { PartTypeController } from './part-type.controller';

describe('PartTypeController', () => {
  let controller: PartTypeController;

  const mockPartTypeService = {
    getListPartType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartTypeController],
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
          provide: PartTypeService,
          useValue: mockPartTypeService,
        },
      ],
    }).compile();

    controller = module.get<PartTypeController>(PartTypeController);
  });

  const ctx = new RequestContext();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get list part type', () => {
    it('should return list part types', async () => {
      const mockPartTypeOutPut = [
        {
          partTypeId: 'PARTTYPE310DGAWYMVZ2EJY2CK',
          partTypeCode: 'CODE',
          isoLocaleCode: 'en',
          partTypeName: 'name',
        },
      ];
      mockPartTypeService.getListPartType.mockResolvedValue(mockPartTypeOutPut);
      const partTypes = await controller.getListPartType(ctx);

      expect(partTypes).toEqual({
        data: mockPartTypeOutPut,
        meta: {},
      });
      expect(mockPartTypeService.getListPartType).toHaveBeenCalledWith(ctx);
    });

    it('should throw error when PartTypeService fail', async () => {
      mockPartTypeService.getListPartType.mockRejectedValue(new Error());

      try {
        await controller.getListPartType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
