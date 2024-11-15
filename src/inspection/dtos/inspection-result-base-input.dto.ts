import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CustomInspectionItemResultType,
  defaultExamples,
  ItemCodeType,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class InspectionResultBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description:
      defaultExamples.CreateInspectionInput.inspectionResults.inspectionItemId
        .description,
  })
  @Length(26, 26)
  @IsString()
  inspectionItemId: string;

  @ApiPropertyOptional(
    defaultExamples.CreateInspectionInput.inspectionResults.itemCode,
  )
  @TrimString()
  @MaxLength(64)
  @IsString()
  @IsOptional()
  @IsEnum(ItemCodeType)
  itemCode: ItemCodeType;

  @ApiProperty(defaultExamples.CreateInspectionInput.inspectionResults.result)
  @IsString()
  @MaxLength(128)
  result: string;

  @ApiProperty(
    defaultExamples.CreateInspectionInput.inspectionResults.isRequired,
  )
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty(
    defaultExamples.CreateInspectionInput.inspectionResults.resultType,
  )
  @IsEnum(CustomInspectionItemResultType)
  resultType: CustomInspectionItemResultType;
}
