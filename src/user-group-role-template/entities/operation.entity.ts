import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Permission } from './permission.entity';

@Entity('operations')
export class Operation extends BaseEntity {
  @PrimaryColumn({ name: 'operation_id' })
  operationId: string;

  @Column({ name: 'operation_code' })
  operationCode: string;

  @OneToMany(() => Permission, (permission) => permission.operation)
  permissions: Permission[];
}
