import { ISOLocaleCode } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Permission } from './permission.entity';

@Entity('permission_translations')
export class PermissionTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'permission_name' })
  permissionName: string;

  @ManyToOne(
    () => Permission,
    (permission) => permission.permissionTranslations,
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
