import { InspectionFormTemplate } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import {
  CustomInspectionItemResultType,
  ISOLocaleCode,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InspectionFormTemplateRepository extends Repository<InspectionFormTemplate> {
  constructor(private dataSource: DataSource) {
    super(InspectionFormTemplate, dataSource.createEntityManager());
  }

  async getInspectionFormTemplateWithResultType(
    inspectionFormTemplateId: string,
    isoLocaleCode: ISOLocaleCode,
    resultType: CustomInspectionItemResultType,
  ) {
    return this.createQueryBuilder('inspectionFormTemplate')
      .leftJoinAndSelect(
        'inspectionFormTemplate.inspectionItemTemplates',
        'inspectionItemTemplates',
        'inspectionItemTemplates.resultType = :resultType',
      )
      .leftJoinAndSelect(
        'inspectionItemTemplates.inspectionItemTemplateTranslation',
        'inspectionItemTemplateTranslation',
        'inspectionItemTemplateTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .setParameters({
        inspectionFormTemplateId,
        isoLocaleCode,
        resultType,
      })
      .getOne();
  }

  async getInspectionItemTemplates(
    localeCode: ISOLocaleCode,
    inspectionFormTemplateId: string,
  ) {
    return this.createQueryBuilder('inspectionFormTemplate')
      .innerJoinAndSelect(
        'inspectionFormTemplate.inspectionItemTemplates',
        'inspectionItemTemplates',
      )
      .innerJoinAndSelect(
        'inspectionFormTemplate.inspectionFormTemplateTranslations',
        'inspectionFormTemplateTranslations',
      )
      .innerJoinAndSelect(
        'inspectionItemTemplates.inspectionItemTemplateTranslations',
        'inspectionItemTemplateTranslations',
      )
      .where(
        'inspectionItemTemplates.inspectionFormTemplateId = :inspectionFormTemplateId AND inspectionItemTemplateTranslations.isoLocaleCode = :localeCode AND inspectionFormTemplateTranslations.isoLocaleCode = :localeCode',
      )
      .setParameters({
        inspectionFormTemplateId,
        localeCode,
      })
      .orderBy('inspectionItemTemplates.position')
      .getOne();
  }
}
