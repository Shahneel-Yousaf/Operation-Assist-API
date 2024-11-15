import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ActionType,
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
} from '@shared/constants';
import { TransformStringNumber } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  ValidateIf,
} from 'class-validator';

export class OilCoolantRefillExchangeBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'oilTypeId',
  })
  @Length(26, 26)
  @IsString()
  oilTypeId: string;

  @ApiProperty({
    description: 'Action type of oil coolant refill exchange',
    enum: ActionType,
    example: ActionType.REFILL,
  })
  @IsString()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Max(9999999.999)
  @ValidateIf((_obj, value) => value !== null)
  @TransformStringNumber()
  fluidInLiters: number | null;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  comment: string;
}
