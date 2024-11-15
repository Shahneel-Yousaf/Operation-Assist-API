import { Injectable } from '@nestjs/common';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ListOilTypeTemplateOutput } from '@template/dtos/list-oil-type-template-output.dto';
import { OilTypeRepository } from '@template/repositories/oil-type.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OilTypeService {
  constructor(
    private readonly repository: OilTypeRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(OilTypeService.name);
  }

  async getListOilType(
    ctx: RequestContext,
  ): Promise<ListOilTypeTemplateOutput[]> {
    this.logger.log(ctx, `${this.getListOilType.name} was called`);

    const isoLocaleCode = ctx.isoLocaleCode;

    const oilTypes = await this.repository.find({
      where: {
        oilTypeTranslation: {
          isoLocaleCode,
        },
      },
      relations: ['oilTypeTranslation'],
    });

    return plainToInstance(
      ListOilTypeTemplateOutput,
      oilTypes.map((oilType) => ({
        ...oilType,
        isoLocaleCode,
        oilTypeName: oilType.oilTypeTranslation.oilTypeName,
      })),
    );
  }
}
