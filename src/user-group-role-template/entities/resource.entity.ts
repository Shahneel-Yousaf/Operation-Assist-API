import { Permission } from '@user-group-role-template/entities/permission.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('resources')
export class Resource extends BaseEntity {
  @PrimaryColumn({ name: 'resource_id' })
  resourceId: string;

  @Column({ name: 'resource_code' })
  resourceCode: string;

  @OneToMany(() => Permission, (permission) => permission.resource)
  permissions: Permission[];
}
