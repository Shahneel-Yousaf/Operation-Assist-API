import { InspectionFormTemplateTranslation } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import { ISOLocaleCode } from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InspectionFormTemplateTranslationRepository extends Repository<InspectionFormTemplateTranslation> {
  constructor(private dataSource: DataSource) {
    super(InspectionFormTemplateTranslation, dataSource.createEntityManager());
  }
  async getInspectionFormTemplateByMachineTypeId(
    localeCode: ISOLocaleCode,
    machineTypeId: string,
  ) {
    return this.createQueryBuilder('inspectionFormTemplateTranslation')
      .select([
        'inspectionFormTemplateTranslation.inspectionFormTemplateId inspectionFormTemplateId',
        'inspectionFormTemplateTranslation.inspectionFormTemplateName inspectionFormTemplateName',
      ])
      .innerJoin(
        'inspectionFormTemplateTranslation.inspectionFormTemplate',
        'inspectionFormTemplate',
      )
      .innerJoin(
        'inspectionFormTemplate.machineTypeInspectionFormTemplates',
        'machineTypeInspectionFormTemplate',
      )
      .where(
        'machineTypeInspectionFormTemplate.machineTypeId = :machineTypeId AND inspectionFormTemplateTranslation.isoLocaleCode = :localeCode',
      )
      .setParameters({
        machineTypeId,
        localeCode,
      })
      .orderBy(
        'inspectionFormTemplateTranslation.inspectionFormTemplateId',
        'DESC',
      )
      .getRawMany();
  }
}
