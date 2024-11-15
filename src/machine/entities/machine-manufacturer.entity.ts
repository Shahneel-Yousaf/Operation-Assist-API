import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Machine } from '.';

@Entity('machine_manufacturers')
export class MachineManufacturer extends BaseEntity {
  @PrimaryColumn({ name: 'machine_manufacturer_id' })
  machineManufacturerId: string;

  @Column({ name: 'machine_manufacturer_name' })
  machineManufacturerName: string;

  @OneToMany(() => Machine, (machine) => machine.machineManufacturer)
  machines: Machine[];
}
