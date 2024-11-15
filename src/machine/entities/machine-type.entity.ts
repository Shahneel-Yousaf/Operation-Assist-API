import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import {
  Machine,
  MachineTypeInspectionFormTemplate,
  MachineTypeTranslation,
} from '.';

@Entity('machine_types')
export class MachineType extends BaseEntity {
  @PrimaryColumn({ name: 'machine_type_id' })
  machineTypeId: string;

  @Column({ name: 'machine_type_code' })
  machineTypeCode: string;

  @Column({ name: 'picture_url' })
  pictureUrl: string;

  @OneToMany(() => Machine, (machine) => machine.machineType)
  machines: Machine[];

  @OneToMany(
    () => MachineTypeTranslation,
    (machineTypeTranslation) => machineTypeTranslation.machineType,
  )
  machineTypeTranslations: MachineTypeTranslation[];

  @OneToOne(
    () => MachineTypeTranslation,
    (machineTypeTranslation) => machineTypeTranslation.machineTypeLocaleCode,
  )
  @JoinColumn({
    name: 'machine_type_id',
    referencedColumnName: 'machineTypeId',
  })
  machineTypeTranslation: MachineTypeTranslation;

  @OneToMany(
    () => MachineTypeInspectionFormTemplate,
    (machineTypeInspectionFormTemplate) =>
      machineTypeInspectionFormTemplate.machineType,
  )
  machineTypeInspectionFormTemplates: MachineTypeInspectionFormTemplate[];
}
