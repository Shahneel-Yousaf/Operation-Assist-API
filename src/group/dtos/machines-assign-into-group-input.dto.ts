import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { IsArrayUnique } from '@shared/validations';
import { ArrayNotEmpty, IsArray, IsString, Length } from 'class-validator';

export class MachinesAssignIntoGroupInput {
  @ApiProperty(defaultExamples.groupIds)
  @IsArrayUnique()
  @Length(26, 26, { each: true })
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  machineIds: string[];
}
