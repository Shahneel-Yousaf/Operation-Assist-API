import { ISOLocaleCode } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { MachineType } from './machine-type.entity';

@Entity('machine_type_translations')
export class MachineTypeTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'machine_type_id' })
  machineTypeId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'type_name' })
  typeName: string;

  @ManyToOne(
    () => MachineType,
    (machineType) => machineType.machineTypeTranslations,
  )
  @JoinColumn({ name: 'machine_type_id' })
  machineType: MachineType;

  @OneToOne(
    () => MachineType,
    (machineType) => machineType.machineTypeTranslation,
  )
  machineTypeLocaleCode: MachineType;
}
