import { PaginationInputQuery } from '@group/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { MachineSummarySortByField, Order } from '@shared/constants';
import { IsEnum } from 'class-validator';

export class GetMachineSummaryOrderBy extends PaginationInputQuery {
  @ApiProperty({
    description: 'Field order by of list machine summary',
    example: MachineSummarySortByField.REPORTED_AT,
    enum: MachineSummarySortByField,
  })
  @IsEnum(MachineSummarySortByField)
  field: MachineSummarySortByField;

  @ApiProperty({
    description: 'Type order by of list machine summary',
    example: Order.ASC,
    enum: Order,
  })
  @IsEnum(Order)
  order: Order;
}
