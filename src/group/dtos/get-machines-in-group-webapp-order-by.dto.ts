import { ApiProperty } from '@nestjs/swagger';
import { MachineSortByField, Order } from '@shared/constants';
import { IsEnum } from 'class-validator';

export class GetMachineInGroupWebappOrderBy {
  @ApiProperty({
    description: 'Field order by of list machine',
    example: MachineSortByField.MACHINE_NAME,
    enum: MachineSortByField,
  })
  @IsEnum(MachineSortByField)
  field: MachineSortByField;

  @ApiProperty({
    description: 'Type order by of list group',
    example: Order.ASC,
    enum: Order,
  })
  @IsEnum(Order)
  order: Order;
}
