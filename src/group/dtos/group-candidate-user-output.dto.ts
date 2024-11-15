import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GroupCandidateUserOutput {
  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'The user candidate ID',
  })
  userId: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty(defaultExamples.userEmail)
  email: string;

  @Expose()
  @ApiProperty({ nullable: true })
  pictureUrl: string;

  @Expose()
  @ApiProperty()
  searchId: string;

  @Expose()
  @ApiPropertyOptional(defaultExamples.isAlreadyInGroup)
  isAlreadyInGroup: boolean;
}
