import { ApiProperty } from '@nestjs/swagger';
import { GroupSortByField, Order } from '@shared/constants';
import { IsEnum } from 'class-validator';

export class GetGroupWebappOrderBy {
  @ApiProperty({
    description: 'Field order by of list group',
    example: GroupSortByField.GROUP_NAME,
    enum: GroupSortByField,
  })
  @IsEnum(GroupSortByField)
  field: GroupSortByField;

  @ApiProperty({
    description: 'Type order by of list group',
    example: Order.ASC,
    enum: Order,
  })
  @IsEnum(Order)
  order: Order;
}
