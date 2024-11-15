import { Injectable } from '@nestjs/common';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ListPartTypeTemplateOutput } from '@template/dtos';
import { PartTypeRepository } from '@template/repositories';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PartTypeService {
  constructor(
    private readonly repository: PartTypeRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(PartTypeService.name);
  }

  async getListPartType(
    ctx: RequestContext,
  ): Promise<ListPartTypeTemplateOutput[]> {
    this.logger.log(ctx, `${this.getListPartType.name} was called`);

    const isoLocaleCode = ctx.isoLocaleCode;

    const partTypes = await this.repository.find({
      where: {
        partTypeTranslation: {
          isoLocaleCode,
        },
      },
      relations: ['partTypeTranslation'],
    });

    return plainToInstance(
      ListPartTypeTemplateOutput,
      partTypes.map((partType) => ({
        ...partType,
        isoLocaleCode,
        partTypeName: partType.partTypeTranslation.partTypeName,
      })),
    );
  }
}
