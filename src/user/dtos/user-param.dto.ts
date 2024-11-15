import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserParam {
  @ApiProperty()
  @IsString()
  userId: string;
}
