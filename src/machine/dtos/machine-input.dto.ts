import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import {
  TransformNullToEmpty,
  TransformUndefinedToNull,
  TrimString,
} from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class MachineInput {
  @ApiProperty()
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @Length(1, 40)
  @IsString()
  machineName: string;

  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'Machine type ID of the machine',
  })
  @Length(26, 26)
  @IsString()
  machineTypeId: string;

  @ApiPropertyOptional()
  @Length(0, 512)
  @IsOptional()
  @IsString()
  @TransformNullToEmpty()
  pictureUrl: string;

  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'Machine manufacturer ID of the machine',
  })
  @Length(26, 26)
  @IsString()
  machineManufacturerId: string;

  @ApiProperty()
  @Length(1, 40)
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @IsString()
  modelAndType: string;

  @ApiProperty()
  @MinLength(1)
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @IsString()
  serialNumber: string;

  @ApiPropertyOptional()
  @Length(0, 512)
  @IsOptional()
  @IsString()
  @TransformNullToEmpty()
  serialNumberPlatePictureUrl: string;

  @ApiPropertyOptional()
  @TransformUndefinedToNull()
  @Length(0, 20)
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @IsString()
  @IsOptional()
  customMachineManufacturerName: string;

  @ApiPropertyOptional()
  @TransformUndefinedToNull()
  @Length(0, 40)
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @IsString()
  @IsOptional()
  customTypeName: string;
}
