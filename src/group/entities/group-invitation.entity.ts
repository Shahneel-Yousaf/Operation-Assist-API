import { InvitationResponse, InvitationType } from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('group_invitations')
export class GroupInvitation extends BaseEntity {
  @PrimaryColumn({ name: 'group_invitation_id' })
  groupInvitationId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'inviter_user_id' })
  inviterUserId: string;

  @CreateDateColumn({ name: 'invited_at' })
  invitedAt: Date;

  @Column({ name: 'invitation_type' })
  invitationType: InvitationType;

  @Column({ name: 'invitee_user_id' })
  inviteeUserId: string;

  @Column({ name: 'invitee_email' })
  inviteeEmail: string;

  @Column({ name: 'invitee_name' })
  inviteeName: string;

  @Column({ name: 'user_group_role_name' })
  userGroupRoleName: string;

  @Column({ name: 'responded_at' })
  respondedAt: Date;

  @Column({ name: 'invitation_response' })
  invitationResponse: InvitationResponse;

  @Column({ name: 'user_group_role_template_id' })
  userGroupRoleTemplateId: string;

  @ManyToOne(() => User, (user) => user.groupInvitees)
  @JoinColumn({ name: 'invitee_user_id' })
  userInvitee: User;

  @ManyToOne(() => User, (user) => user.groupInviters)
  @JoinColumn({ name: 'inviter_user_id' })
  userInviter: User;
}
