import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
} from '@shared/constants';
import { TransformStringNumber } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class FuelRefillBaseInput {
  @ApiProperty()
  @IsNumber()
  @Max(9999999.999)
  @TransformStringNumber()
  fuelInLiters: number;

  @ApiProperty()
  @IsBoolean()
  isAdblueRefilled: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  comment: string;
}
