import { PartReplacement } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { PartTypeTranslation } from '.';

@Entity('part_types')
export class PartType extends BaseEntity {
  @PrimaryColumn({ name: 'part_type_id' })
  partTypeId: string;

  @Column({ name: 'part_type_code' })
  partTypeCode: string;

  @OneToOne(
    () => PartTypeTranslation,
    (partTypeTranslation) => partTypeTranslation.partType,
  )
  @JoinColumn({
    name: 'part_type_id',
    referencedColumnName: 'partTypeId',
  })
  partTypeTranslation: PartTypeTranslation;

  @OneToMany(
    () => PartReplacement,
    (partReplacement) => partReplacement.partType,
  )
  partReplacements: PartReplacement[];
}
