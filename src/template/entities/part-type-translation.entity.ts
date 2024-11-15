import { ISOLocaleCode } from '@shared/constants';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { PartType } from '.';

@Entity('part_type_translations')
export class PartTypeTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'part_type_id' })
  partTypeId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'part_type_name' })
  partTypeName: string;

  @OneToOne(() => PartType, (partType) => partType.partTypeTranslation)
  partType: PartType;
}
