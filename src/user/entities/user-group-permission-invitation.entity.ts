import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_group_permission_invitations')
export class UserGroupPermissionInvitation extends BaseEntity {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: string;

  @PrimaryColumn({ name: 'group_invitation_id' })
  groupInvitationId: string;

  @Column({ name: 'invited_at' })
  invitedAt: Date;
}
