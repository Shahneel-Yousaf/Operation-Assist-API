import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  GroupMachineCondition,
  MachineField,
} from '@shared/constants';
import { PaginationQuery } from '@shared/dtos';
import { IsArrayUnique } from '@shared/validations';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { GetMachineInGroupWebappOrderBy } from '.';

export class GetMachineInGroupWebappQuery extends PaginationQuery {
  @ApiPropertyOptional({
    type: GetMachineInGroupWebappOrderBy,
  })
  @IsArrayUnique('field')
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetMachineInGroupWebappOrderBy)
  orderBys: GetMachineInGroupWebappOrderBy[];

  @ApiPropertyOptional(defaultExamples.machineCondition)
  @IsOptional()
  @IsEnum(GroupMachineCondition)
  machineCondition: GroupMachineCondition;

  @ApiPropertyOptional({
    description: 'Get fields of machine',
    enum: MachineField,
    example: MachineField.MACHINE_NAME,
  })
  @IsArrayUnique()
  @IsArray()
  @IsOptional()
  @IsEnum(MachineField, { each: true })
  select: MachineField[];
}
