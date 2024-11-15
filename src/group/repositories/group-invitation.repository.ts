import { GroupInvitation } from '@group/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';

@Injectable()
export class GroupInvitationRepository extends Repository<GroupInvitation> {
  constructor(private dataSource: DataSource) {
    super(GroupInvitation, dataSource.createEntityManager());
  }

  async getGroupInvitation(
    inviteeEmail: string,
    groupId: string,
  ): Promise<GroupInvitation> {
    return this.findOne({
      where: {
        groupId,
        inviteeEmail,
        invitationResponse: IsNull(),
      },
    });
  }
}
