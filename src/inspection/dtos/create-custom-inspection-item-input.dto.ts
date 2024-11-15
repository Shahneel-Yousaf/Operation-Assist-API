import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { IsOptional, IsString, Length } from 'class-validator';

import { CustomInspectionItemBaseInput } from '.';

export class CreateCustomInspectionItemInput extends CustomInspectionItemBaseInput {
  @ApiPropertyOptional(defaultExamples.entityId)
  @Length(26, 26)
  @IsString()
  @IsOptional()
  inspectionItemId: string;
}
