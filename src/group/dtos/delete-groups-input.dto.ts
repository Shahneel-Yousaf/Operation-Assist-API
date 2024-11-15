import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { IsArrayUnique } from '@shared/validations';
import { ArrayNotEmpty, IsArray, IsString, Length } from 'class-validator';

export class DeleteGroupsInput {
  @ApiProperty(defaultExamples.groupIdArray)
  @IsArrayUnique()
  @IsArray()
  @IsString({ each: true })
  @Length(26, 26, { each: true })
  @ArrayNotEmpty()
  groupIds: string[];
}
