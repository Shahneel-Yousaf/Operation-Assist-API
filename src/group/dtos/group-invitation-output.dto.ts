import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  InvitationResponse,
  InvitationType,
} from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class GroupInvitationOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupInvitationId: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'The user ID who sent the invitation.',
  })
  inviterUserId: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.dateTime,
    description: 'The date when the invitation was sent',
  })
  invitedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Invitation type',
    example: InvitationType.EMAIL_INVITE,
    enum: InvitationType,
  })
  @IsEnum(InvitationType)
  invitationType: InvitationType;

  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'The user ID who was invited',
  })
  inviteeUserId: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.userEmail,
    description: 'The email who was invited',
  })
  inviteeEmail: string;

  @Expose()
  @ApiProperty()
  inviteeName: string;

  @Expose()
  @ApiProperty()
  userGroupRoleName: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.dateTime,
    description: 'Time the invitee responds to the invitation.',
  })
  respondedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Invitation type',
    example: InvitationResponse.ACCEPTED,
    enum: InvitationResponse,
  })
  @IsEnum(InvitationResponse)
  invitationResponse: InvitationResponse;
}
