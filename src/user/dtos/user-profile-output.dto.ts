import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserProfileOutput {
  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  pictureUrl: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  registeredAt: Date;

  @Expose()
  @ApiProperty()
  isoLocaleCode: string;

  @Expose()
  @ApiProperty()
  companyName: string;
}
