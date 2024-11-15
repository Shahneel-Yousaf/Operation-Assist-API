import { ApiProperty } from '@nestjs/swagger';
import { MachineReportSortByField, Order } from '@shared/constants';
import { IsEnum } from 'class-validator';

export class GetMachineReportsForWebappOrderBy {
  @ApiProperty({
    description: 'Field order by of list machine report',
    example: MachineReportSortByField.REPORTED_AT,
    enum: MachineReportSortByField,
  })
  @IsEnum(MachineReportSortByField)
  field: MachineReportSortByField;

  @ApiProperty({
    description: 'Type order by of list machine report',
    example: Order.ASC,
    enum: Order,
  })
  @IsEnum(Order)
  order: Order;
}
