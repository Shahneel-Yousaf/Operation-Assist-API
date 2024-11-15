import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { IsArrayUnique } from '@shared/validations';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class GroupsUserArchiveStatusInput {
  @ApiProperty(defaultExamples.groupIds)
  @IsArrayUnique()
  @Length(26, 26, { each: true })
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  groupIds: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isArchived: boolean;
}
