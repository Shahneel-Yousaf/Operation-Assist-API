import { ISOLocaleCode } from '@shared/constants';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { OilType } from '.';

@Entity('oil_type_translations')
export class OilTypeTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'oil_type_id' })
  oilTypeId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'oil_type_name' })
  oilTypeName: string;

  @OneToOne(() => OilType, (oilType) => oilType.oilTypeTranslation)
  oilType: OilType;
}
